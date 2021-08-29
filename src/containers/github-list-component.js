import React, {Component} from 'react';
import debounce from '../utils/debounce';
import {getRepoList} from '../utils/data-service';
import RepoComponent from '../components/repo-component';

export default class GithubListComponent extends Component{
    constructor(){
        super();
        this.state = {
            input: '',
            repoList: [],
            loading: false,
            error: null,
            page: 1
        }
        // this.changeHandler = debounce(this.changeHandler, 500);
        this.getData = debounce(this.getData, 500);
        this.perPage = 30;
        this.totalCount = 0;
    }

    changeHandler = (event) => {
        const input = event.target.value;
        this.setState({input}, () => {
            this.getData(1);
        })
    }

    clickHandler = () => {
        const {page} = this.state;
        const curPage = page + 1;
        this.getData(curPage);
    }

    getData = (page) => {
        const {input} = this.state
        if(input === ''){
            this.totalCount = 0;
            this.setState({repoList: [], page: 1});
        }else {
            this.setState({loading: true})
            getRepoList(input, this.perPage, page).then(response => response.json())
                .then(data => {
                    this.totalCount = data.total_count;
                    if( page === 1){
                        const repoList = data.items;
                        this.setState({repoList, error: null, page})
                    } else {
                        const {repoList} = this.state
                        // handle duplicate
                        data.items.shift();
                        this.setState({repoList: [...repoList, ...data.items], error: null, page})
                    }
                }).catch(e => {
                    this.setState({repoList: [], error: e})
                }).finally(() => {
                    this.setState({loading: false})
                });
        }
    }

    render(){
        const {loading, repoList, input, page} = this.state;
        const loadingTextCSS = { display: loading ? "block" : "none" };
        return (
            <div className="container">
                <div className="search">
                    <input type="text" placeholder="Search github repo" value={input} onChange={this.changeHandler} data-testid="search-input"/>
                </div>
                <div id="list" className="repo-list">
                    {repoList && repoList.map(repo => (
                        <RepoComponent repo={repo} key={`${repo.id}-${repo.node_id}`}/>
                    ))}
                    {loading && (<div className="loading" ref={loadingRef => (this.loadingRef = loadingRef)}>
                        <span style={loadingTextCSS}>Loading...</span>
                    </div>)}
                </div>
                {this.totalCount > 0 && (<div className="pagination">
                    <span> {this.totalCount > 0 && `Showing ${this.perPage*page} of ${this.totalCount} repositories`} </span>
                    <button type="submit" onClick={this.clickHandler} data-testid="load-more">Load More</button>
                </div>)}
            </div>
        );
    }
}