define([
    "jquery",
    "backbone",
    "./confirm-deploy-view",
    "./verify-log-view",
    "./version-dialog-view",
    "./deploy-log-dialog-view"
],
function($, Backbone, ConfirmDeployView, VerifyLogView, VersionDialogView, DeployLogDialogView) {

	var VerifyCommand = Backbone.Model.extend({
        url: "/deploy/verify"
    });

	return Backbone.Marionette.ItemView.extend({
        template: "deploy-unit-item",
        tagName: "tr",
        className: "deploy-unit",
        events: {
            "click .btn-deploy": "deploy",
            "click .btn-verify": "verify",
            "click .verify-log-link": "verifyLog",
            "click .select-version": "selectVersion",
            "click .deploy-log-link": "openDeployLog"
        },

        initialize: function() {
            _.bindAll(this);

            this.model.on("change", this.render, this);
        },

        deploy: function (e) {
            var confirmView = new ConfirmDeployView({ deployUnit: this.model });
            confirmView.show();
        },

        verify: function(e) {
            new VerifyCommand({
                agentName: this.model.get("agentName"),
                unitName: this.model.get("unitName")
            }).save();

            this.model.set({ info: { verifying: true, steps: [], pass: true } });
        },

        verifyLog: function(e) {
            e.preventDefault();
            new VerifyLogView({model: this.model}).show();
        },

        selectVersion: function(e) {
            e.preventDefault();

            var versionView = new VersionDialogView({ agentName: this.model.get('agentName'), unitName: this.model.get('unitName') });
            versionView.on("versionSelected", this.versionSelected, this);
            versionView.show();
        },

        versionSelected: function(versionId, version, branch) {

            this.model.set({
                    version: version,
                    versionId: versionId,
                    branch: branch,
                    enableDeploy: true
            });
        },

        openDeployLog: function(e) {
            e.preventDefault();

            var deployLog = new DeployLogDialogView({ agentName: this.model.get('agentName'), unitName: this.model.get('unitName') });
            deployLog.show();

        }



    });
});