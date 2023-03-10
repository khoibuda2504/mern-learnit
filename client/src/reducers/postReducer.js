import { POSTS_LOADED_SUCCESS, POSTS_LOADED_FAIL, ADD_POST, UPDATE_POST, DELETE_POST, FIND_POST } from "../contexts/constants"
export const postReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case POSTS_LOADED_SUCCESS:
      return {
        ...state,
        posts: payload,
        postLoading: false
      }
    case POSTS_LOADED_FAIL:
      return {
        ...state,
        posts: [],
        postLoading: false
      }
    case ADD_POST:
      return {
        ...state,
        posts: [...state.posts, payload]
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(it => it._id !== payload)
      }
    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === payload._id) {
            return payload
          }
          return post
        })
      }
    case FIND_POST:
      return {
        ...state,
        post: payload
      }
    default:
      return state
  }
}