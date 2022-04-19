/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    isUser: currentUser && currentUser.access === 'user',
    isAdmin: currentUser && currentUser.access === 'admin',
  };
}
