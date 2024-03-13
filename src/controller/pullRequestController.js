const pullRequestService = require('../services/pullRequestService');

async function getFileChanges(req, res) {
    if(req.body.action!=="closed") return
    const { repository,pull_request } = req.body;
    try {
        const result = await pullRequestService.getFileChanges({owner:repository.owner.login, repo:repository.name, mainBranch:pull_request.base.ref, featureBranch:pull_request.head.ref, pullNumber:pull_request.number});
        console.log("----result",result,"resul")
        res.status(200).json(result);
    } catch (error) {
        console.error("Failed to fetch file changes:", error);
        res.status(500).json({ error: "Failed to fetch file changes" });
    }
}

module.exports = {
    getFileChanges,
};
