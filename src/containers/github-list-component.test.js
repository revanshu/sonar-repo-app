import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import GithubListComponent from './github-list-component';


const mockResponse = {
    total_count: 3,
    items: [
        {
            node_id: 'random1',
            id: 'id1',
            clone_url: 'repo url',
            name: 'repo name 1',
            description: 'desc',
            owner:{
                avatar_url: 'url'
            }
        },
        {
            node_id: 'random2',
            id: 'id2',
            clone_url: 'repo url',
            name: 'repo name 2',
            description: 'desc',
            owner:{
                avatar_url: 'url'
            }
        },
        {
            node_id: 'random3',
            id: 'id3',
            clone_url: 'repo url',
            name: 'repo name 3',
            description: 'desc',
            owner:{
                avatar_url: 'url'
            }
        }
    ]
};

afterEach(() => {
    jest.restoreAllMocks();
  });

test('on search repo', async () =>{
    const mockJsonPromise = Promise.resolve(mockResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    var globalRef =global;
    globalRef.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    render(<GithubListComponent />);
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: 'sonar' } })
    const items = await screen.findAllByText(/repo name [1-3]/);
    expect(items).toHaveLength(3);
})

test('on load more repo', async () =>{
    const mockJsonPromise = Promise.resolve(mockResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    var globalRef =global;
    globalRef.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    render(<GithubListComponent />);
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: 'sonar' } })
    await waitFor(() => expect(globalRef.fetch).toHaveBeenCalledTimes(1))
    const button = screen.getByTestId("load-more");
    fireEvent.click(button)
    await waitFor(() => expect(globalRef.fetch).toHaveBeenCalledTimes(1));
})