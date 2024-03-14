const { Octokit } = require("@octokit/core");
const OpenAI = require("openai") ;
const { sendEmail } = require("../utils/sendEmail") ;
const pdfmake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs');
pdfMake.vfs = vfsFonts.pdfMake.vfs;
const {Gittoken,apiKey} = require("constants")

const openai = new OpenAI({apiKey:apiKey});
const octokit = new Octokit({
    auth: token
});

async function getFileContent(owner, repo, branch, filename) {
    try {
        // Get the contents of the file from the specified branch
        const fileContentResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: filename,
            ref: branch
        });
        const content = Buffer.from(fileContentResponse.data.content, 'base64').toString('utf-8');
        return {
            filename: filename,
            content: content
        };
    } catch (error) {
        console.error("Error fetching file content:", error.message);
        return {}
    }
}

async function getFileChanges({owner, repo, mainBranch, featureBranch, pullNumber}) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
            owner: owner,
            repo: repo,
            pull_number: pullNumber
        });
        const files = response.data;

        const fileChanges = [];


        for (const file of files) {
            const mainContent = await getFileContent(owner, repo, mainBranch, file.filename);
            const featureContent = await getFileContent(owner, repo, featureBranch, file.filename);

            fileChanges.push({
                fileName: file.filename,
                old_code: mainContent.content,
                new_code: featureContent.content
            }); 
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }, {"role": "user", "content": `compare the code changes from the given data ${fileChanges}. how new code  impact old code  and what are things qa should test after changing oldcode  to newcode`},],
            model: "gpt-3.5-turbo",
          });
          console.log(completion.choices[0]);
        
        
          const completion1 = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }, {"role": "user", "content": `create technical report based on ${completion.choices[0].message.content}`},],
            model: "gpt-3.5-turbo",
          });
         
          const completion2 = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful json file creater." }, {"role": "user", "content": `Give me this technical report on pdfmake libary input format for creating  pdf ${completion1.choices[0].message.content}`},],
            model: "gpt-3.5-turbo",
          });
          const completion3 = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful json file creater." }, {"role": "user", "content": `this is not correct format for pdfmake its correct format is {cotent:[{text:"",syle:""}],styles:{}} ${completion2.choices[0].message.content}`},],
            model: "gpt-3.5-turbo",
          });
        
        
          const completion4 = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful json file creater." }, {"role": "user", "content": `remove extra text from this json if it exists above or below of this json ${completion3.choices[0].message.content}`},],
            model: "gpt-3.5-turbo",
          });

          const docDefinition= JSON.parse(completion4.choices[0].message.content)
          let pdfDoc = pdfmake.createPdf(docDefinition);        
            pdfDoc.getBuffer((buffer) => {


            if (err) throw err;

            fs.writeFile('qa_report.pdf', buffer, (err) => {
                let mailOptions = {
                    from: 'testmail4635@gmail.com',
                    to: 'surajdhakal427@gmail.com',
                    subject: 'Qa report',
                    text: 'Detailed qa report for testing',
                    attachments: [
                        {
                            filename: 'qa_report.pdf',
                            path: 'qa_report.pdf'
                        }
                    ]
                };
                sendEmail({mailOptions})
            })
            
            })

       return {
            fileChanges: fileChanges,
            branch: {
                base_branch: mainBranch,
                current_branch: featureBranch
            }
        }
    } catch (error) {
        console.error("Error fetching file changes:", error.message);
        throw error;
    }
}

module.exports = {
    getFileChanges,
};
