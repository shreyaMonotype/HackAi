const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
});

async function getFileContent(owner, repo, branch, filename) {
    console.log('oooapsdfasdfasdfasdfasdfs')
    try {
        console.log("Fetching file content for:", { owner, repo, branch, filename });
        // Get the contents of the file from the specified branch
        const fileContentResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: filename,
            ref: branch
        });
        const content = Buffer.from(fileContentResponse.data.content, 'base64').toString('utf-8');
        console.log({owner, repo, branch, filename,content})
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
    console.log({owner, repo, mainBranch, featureBranch, pullNumber},'------asfdasdfas')
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
            owner: owner,
            repo: repo,
            pull_number: pullNumber
        });
        console.log(response.data,'----respo')
        const files = response.data;

        const fileChanges = [];


        for (const file of files) {
            console.log("----- i am here")
            const mainContent = await getFileContent(owner, repo, mainBranch, file.filename);
            const featureContent = await getFileContent(owner, repo, featureBranch, file.filename);

            fileChanges.push({
                fileName: file.filename,
                old_code: mainContent.content,
                new_code: featureContent.content
            }); 
        }
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
