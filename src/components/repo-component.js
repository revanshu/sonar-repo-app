import React from 'react';

export default function RepoComponent(props){
    const {repo} = props;
    return (
        <div className="repo">
            <div className="avatar">
                <img src={repo.owner.avatar_url} alt="Avatar"/>
            </div>
            <div className="user-details">
                <a href={`${repo.clone_url}`} target="_blank" rel="noreferrer">{repo.name}</a>
                {repo.description}
                <div>Forks: {repo.forks} Stars: {repo.stargazers_count} </div>
            </div>
        </div>
    );
}