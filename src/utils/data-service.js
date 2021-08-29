export function getRepoList(input, perPage, page){
    return fetch(`https://api.github.com/search/repositories?q=${input}&per_page=${perPage}&page=${page}`);
}