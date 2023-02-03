import fs from "fs";
import path from "path";

console.clear();

const opt = process.argv;

const command = opt[2];
const filepath =
    opt[3] === undefined
        ? process.cwd()
        : path.resolve(process.cwd(), opt[3]);
const destination =
    opt[4] === undefined ? null : path.resolve(process.cwd(), opt[4]);

    console.log(
        "Usage: node index.js [command] [filepath] [destination]\n\nCommands:\n\t-ls\t\tList directory contents\n\t-cp\t\tCopy file to destination\n\t-mv\t\tMove file to destination\n\t-mkdir\t\tCreate directory\n\t-rm\t\tRemove file\n\t-pwd\t\tPrint working directory"
    );
switch (command) {
    case "-ls":
        listDirContents(filepath);
        break;
    case "-cp":
        if (destination === null) {
            console.error("Please provide a destination path");
            break;
        }
        copyFileToDestination(filepath, destination);
        break;
    case "-mv":
        if (destination === null) {
            console.error("Please provide a destination path");
            break;
        }
        moveFileToDestination(filepath, destination);
        console.log("move");
        break;
    case "-mkdir":
        createDir(filepath);
        break;
    case "-rm":
        removeFile(filepath);
        break;
    case "-pwd":
        console.log(process.cwd());
        break;
    default:
        console.log("Please provide valid input");
}

async function listDirContents(filepath: string) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file: string) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });

        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}

async function copyFileToDestination(filepath: string, destination: string) {
    try {
        await fs.promises.copyFile(
            filepath,
            destination + "/" + path.basename(filepath)
        );
        console.log("The file has been copied successfully");
    } catch (error) {
        console.error("Error occurred while copying the file!", error);
    }
}

async function moveFileToDestination(filepath: string, destination: string) {
    try {
        await fs.promises.rename(
            filepath,
            destination + "/" + path.basename(filepath)
        );
        console.log("The file has been moved successfully");
    } catch (error) {
        console.error("Error occurred while moving the file!", error);
    }
}

async function removeFile(filepath: string) {
    try {
        await fs.promises.unlink(filepath);
        console.log("The file has been removed successfully");
    } catch (error) {
        console.error("Error occurred while removing the file!", error);
    }
}

function createDir(filepath: string) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log("The directory has been created successfully");
    } else {
        console.log("The directory already exists");
    }
}