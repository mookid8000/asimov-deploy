﻿/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

using System;
using System.Net;
using AsimovDeploy.WinAgent.Framework.Common;
using AsimovDeploy.WinAgent.Framework.Configuration;
using AsimovDeploy.WinAgent.Framework.Events;
using AsimovDeploy.WinAgent.Framework.Models;

namespace AsimovDeploy.WinAgent.Framework.Tasks
{
    public class VerifySiteTask : AsimovTask
    {
        private readonly WebSiteDeployUnit _deployUnit;

        public VerifySiteTask(WebSiteDeployUnit deployUnit)
        {
            _deployUnit = deployUnit;
        }

        protected override void Execute()
        {
            if (_deployUnit.VerifyUrls.Count == 0)
            {
                Log.Warn("No verify urls configured for site");
                return;
            }

            foreach (string url in _deployUnit.VerifyUrls)
            {
                try
                {
                    DoWebRequest(url, _deployUnit.SiteUrl);
                }
                catch (Exception ex)
                {
                    NodeFront.Notify(new VerifyProgressEvent()
                    {
                        pass = false,
                        message = string.Format("Could not load url: {0} - {1}", url, ex.Message),
                        completed = false,
                        unitName = _deployUnit.Name
                    });
                    return;
                }
            }

            NodeFront.Notify(new VerifyProgressEvent() { completed = true, unitName = _deployUnit.Name, pass = true });
        }

        private bool DoWebRequest(string url, string siteUrl)
        {
            var pageUri = GetPageUri(url, siteUrl);

            var request = WebRequest.Create(pageUri) as HttpWebRequest;
            request.Timeout = 120000;

            using (var resp = (HttpWebResponse) request.GetResponse())
            {
                NodeFront.Notify(new VerifyProgressEvent()
                {
                    pass = resp.StatusCode == HttpStatusCode.OK,
                    message = string.Format("{0} - {1}", url, resp.StatusCode),
                    completed = false,
                    unitName = _deployUnit.Name
                });
            }

            return false;
        }

        private Uri GetPageUri(string url, string siteUrl)
        {
            if (url.StartsWith("http"))
                return new Uri(url);

            if (!siteUrl.EndsWith("/"))
                siteUrl += "/";

            return new Uri(new Uri(siteUrl), url);
        }
    }
}