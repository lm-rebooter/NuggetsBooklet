import got from "got";
import fse from "fs-extra";

const cookies = fse.readJSONSync("./cookies.json");

const cookie = cookies.reduce(
    (prev, curr) => prev + `${curr.name}=${curr.value};`,
    ""
);

export const getBooks = async () => {
    const response = await got
        .post("https://api.juejin.cn/booklet_api/v1/booklet/bookletshelflist", {
            headers: {
                cookie: cookie,
            },
        })
        .json();

    const books = response.data.map((book) => ({
        value: book.booklet_id,
        name: book.base_info.title,
    }));

    return books;
};

export const getBookInfo = async (bookId) => {
    const response = await got
        .post("https://api.juejin.cn/booklet_api/v1/booklet/get", {
            json: { booklet_id: bookId },
            headers: {
                cookie,
            },
        })
        .json();
    const booklet = response.data.booklet;
    const sections = response.data.sections.map((section, index) => ({
        id: section.section_id,
        title: section.title,
        status: section.status,
        index: index + 1,
    }));
    return {
        booklet,
        sections,
    };
};

export const getSection = async (sectionId) => {
    const response = await got
        .post("https://api.juejin.cn/booklet_api/v1/section/get", {
            json: { section_id: sectionId },
            headers: {
                cookie,
            },
        })
        .json();
    return {
        title: response.data.section.title,
        content: response.data.section.markdown_show,
    };
};
