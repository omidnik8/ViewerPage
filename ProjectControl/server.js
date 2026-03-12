const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// Project root is one level above ProjectControl
const projectRoot = path.join(__dirname, "..");

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Check existence of Assets and Templates
app.get("/api/folders-status", (_req, res) => {
    const assetsPath = path.join(projectRoot, "Assets");
    const templatesPath = path.join(projectRoot, "Templates");

    const assetsExists =
        fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory();
    const templatesExists =
        fs.existsSync(templatesPath) && fs.statSync(templatesPath).isDirectory();

    res.json({ assetsExists, templatesExists });
});

// Create missing folders according to the FoldersGenerator rules
app.post("/api/folders-generate", (req, res) => {
    const { createAssets, createTemplates } = req.body || {};
    const created = [];

    if (createAssets) {
        const assetsRoot = path.join(projectRoot, "Assets");
        ensureDir(assetsRoot);
        ensureDir(path.join(assetsRoot, "Archive"));
        created.push("Assets", "Assets/Archive");
    }

    if (createTemplates) {
        const templatesRoot = path.join(projectRoot, "Templates");
        ensureDir(templatesRoot);
        const assetNameRoot = path.join(templatesRoot, "AssetName");
        ensureDir(assetNameRoot);
        ensureDir(path.join(assetNameRoot, "Archive"));
        created.push(
            "Templates",
            "Templates/AssetName",
            "Templates/AssetName/Archive",
        );
    }

    res.json({ ok: true, created });
});

// List asset categories = subfolders directly under Assets
app.get("/api/asset-categories", (_req, res) => {
    const assetsRoot = path.join(projectRoot, "Assets");
    let categories = [];

    if (fs.existsSync(assetsRoot)) {
        const entries = fs.readdirSync(assetsRoot, { withFileTypes: true });
        categories = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    }

    res.json({ categories });
});

// Create an asset folder inside a chosen category under Assets
app.post("/api/create-asset", (req, res) => {
    const { name, category } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
        return res
            .status(400)
            .json({ ok: false, error: "Asset name is required." });
    }

    const trimmed = name.trim();
    const nameIsValid = /^[A-Za-z0-9 _-]+$/.test(trimmed);
    if (!nameIsValid) {
        return res.status(400).json({
            ok: false,
            error:
                "Invalid asset name. Only letters, numbers, spaces, underscore and dash are allowed.",
        });
    }

    if (!category) {
        return res
            .status(400)
            .json({ ok: false, error: "Asset category is required." });
    }

    const assetDir = path.join(projectRoot, "Assets", category, trimmed);
    ensureDir(assetDir);
    ensureDir(path.join(assetDir, "Archive"));

    res.json({
        ok: true,
        assetPath: path.relative(projectRoot, assetDir),
    });
});

// Serve the ProjectControl UI itself
app.use(express.static(__dirname));

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Project Control server running at http://localhost:${port}`);
});

