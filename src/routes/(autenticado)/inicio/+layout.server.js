export async function load({ parent }) {
    let { title } = await parent();
    title = title ? `${title} - Início` : "Início"
    return { title };
}