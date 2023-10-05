import menuData from "../data/menuData"

export const covertInfoHalamanToNameButton = (pathPage) => {
    const filterDataMenuByPathPage = menuData.filter((data) => {
        return data.toLink === pathPage
    })

    if (filterDataMenuByPathPage.length === 0) return ""
    return filterDataMenuByPathPage[0].nameLink
}