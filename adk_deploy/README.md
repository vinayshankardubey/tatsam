# Tatsam Agent — Deploy Guide

This folder packages the Tatsam ADK multi-agent system (root `tatsam_ask` +
`numerology_agent` + `shastra_agent`) for deployment to Google Cloud's
**Agent Runtime** via the `agents-cli` tool.

## Why we're here

The agent designed in Agent Platform Studio stays in *Draft* until it's
deployed. The Studio UI has no public "publish" button that exposes the agent
via the REST `/interactions` endpoint, so we deploy from the CLI instead.
After deploy, we get a stable resource URL the Next.js app can call.

## Deploy from Cloud Shell (no local installs)

Open [Google Cloud Shell](https://shell.cloud.google.com/?project=tatsam-494417),
then run these four commands. You only do this once per agent change.

```bash
# 1. Upload this folder. From your local terminal first:
#    (run this from the tatsam project root, not from Cloud Shell)
#    cd /Users/vinaydubey/Documents/Vinay/myprojects/tatsam
#    gcloud cloud-shell scp --recurse adk_deploy cloudshell:~/tatsam-agent
#
#    OR easier — open Cloud Shell, click the three-dot menu (⋮) in the top
#    bar → "Upload" → select the entire adk_deploy folder. Rename it to
#    tatsam-agent in Cloud Shell:  mv adk_deploy tatsam-agent

cd ~/tatsam-agent

# 2. Install the Agents CLI (uses pipx so it's isolated)
pip install --user google-agents-cli
export PATH="$HOME/.local/bin:$PATH"
agents-cli --version

# 3. One-time scaffold — adds agent_runtime_app.py the CLI needs
agents-cli scaffold enhance --deployment-target agent_runtime --yes

# 4. Deploy. Takes 5–10 minutes the first time.
agents-cli deploy --project tatsam-494417 --region us-central1
```

After deploy finishes, the CLI prints the deployed agent's URL. It looks like:

```
https://us-central1-aiplatform.googleapis.com/v1/projects/tatsam-494417/locations/us-central1/reasoningEngines/<NUMERIC_ID>
```

Copy the numeric ID — you'll paste it back here and we update `.env.local`.

## After deploy — verify

```bash
agents-cli run --url "<that full URL>" --mode adk "Namaste"
```

If it streams a JSON response, the agent is live.

## What changes on the Next.js side

Once deployed, the `/interactions` endpoint we'd been targeting is the wrong
one — Agent Runtime uses a different shape. We'll switch
`app/api/ask/route.ts` to call the runtime's `:streamQuery` endpoint instead.
