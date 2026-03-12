const browseRoot = document.getElementById("browse-root");
const detailsContent = document.getElementById("details-content");

// Simple initial message in Browse panel
browseRoot.innerHTML = "";
const initialNote = document.createElement("p");
initialNote.className = "pc-empty-note";
initialNote.textContent =
    "Use the tools on the left. Each tool will show you the exact terminal commands to run.";
browseRoot.appendChild(initialNote);

function showDetails(titleText, pillText, bodyLines) {
    detailsContent.innerHTML = "";

    const header = document.createElement("div");
    header.className = "pc-details-header";

    const title = document.createElement("div");
    title.className = "pc-details-title";
    title.textContent = titleText;

    const pill = document.createElement("div");
    pill.className = "pc-pill";
    pill.textContent = pillText;

    header.appendChild(title);
    header.appendChild(pill);

    const field = document.createElement("div");
    field.className = "pc-field";

    const label = document.createElement("label");
    label.textContent = "What to do next (copy/paste in a terminal)";

    const textarea = document.createElement("textarea");
    textarea.rows = 10;
    textarea.readOnly = true;
    textarea.value = bodyLines.join("\n");

    field.appendChild(label);
    field.appendChild(textarea);

    detailsContent.appendChild(header);
    detailsContent.appendChild(field);
}

function runFoldersGeneratorPrompt() {
    const projectRoot =
        '/Users/omidnik/Library/CloudStorage/GoogleDrive-omidnik@gmail.com/My Drive/DOCUMENTs/Work/ARviewer/ViewerPage';

    showDetails("FoldersGenerator", "TERMINAL STEPS", [
        `cd "${projectRoot}"`,
        'mkdir -p "Assets/Archive"',
        'mkdir -p "Templates/AssetName/Archive"',
    ]);
}

function runAssetCreatorPrompt() {
    const projectRoot =
        '/Users/omidnik/Library/CloudStorage/GoogleDrive-omidnik@gmail.com/My Drive/DOCUMENTs/Work/ARviewer/ViewerPage';

    showDetails("AssetCreator", "TERMINAL STEPS", [
        `cd "${projectRoot}"`,
        'ASSET_NAME="Forest Cabin v2"',
        'CATEGORY="Cabins"',
        'mkdir -p "Assets/$CATEGORY"',
        'cp -R "Templates/AssetName" "Assets/$CATEGORY/$ASSET_NAME"',
    ]);
}

function runCategoryGeneratorPrompt() {
    const projectRoot =
        '/Users/omidnik/Library/CloudStorage/GoogleDrive-omidnik@gmail.com/My Drive/DOCUMENTs/Work/ARviewer/ViewerPage';

    showDetails("CategoryGenerator", "TERMINAL STEPS", [
        `cd "${projectRoot}"`,
        'CATEGORY_NAME="Cabins"',
        'mkdir -p "Assets/$CATEGORY_NAME"',
    ]);
}

// Wire tool buttons to show prompts
document.querySelectorAll(".pc-tool-button").forEach((btn) => {
    const tool = btn.dataset.tool;
    if (tool === "folders-generator") {
        btn.addEventListener("click", runFoldersGeneratorPrompt);
    } else if (tool === "asset-creator") {
        btn.addEventListener("click", runAssetCreatorPrompt);
    } else if (tool === "category-generator") {
        btn.addEventListener("click", runCategoryGeneratorPrompt);
    }
});

