import fs from "fs";
import inquirer from "inquirer";
import fse from "fs-extra";

import { getBooks, getBookInfo, getSection } from "./utils.js";

const main = async () => {
    const books = await getBooks();

    const { bookId } = await inquirer.prompt([
        {
            type: "list",
            name: "bookId",
            message: "请选择要下载的小册",
            choices: books,
        },
    ]);

    const { booklet, sections } = await getBookInfo(bookId);

    const bookName = booklet.base_info.title;

    fse.ensureDirSync(bookName);

    const [finishSections, progressSections] = sections.reduce(
        (prev, curr) => {
            if (curr.status === 1) {
                prev[0].push(curr);
            } else {
                prev[1].push(curr);
            }
            return prev;
        },
        [[], []]
    );

    console.log(
        `获取目录成功：完结 ${finishSections.length}章，写作中 ${progressSections.length}章`
    );

    for (let i = 0; i < finishSections.length; i++) {
        const section = finishSections[i];
        const sectionInfo = await getSection(section.id);
        const sectionPath = `${bookName}/${
            section.index
        }.${sectionInfo.title.replaceAll("/", "\\")}.md`;
        fs.writeFileSync(sectionPath, sectionInfo.content);
        console.log(`第 ${section.index} 章下载完成`);
    }

    console.log(`小册 ${bookName} 下载完成`);
};

main();
