export default function({ $auth, redirect }) {
  if (
    $auth.user.type !== 'Main Admin' &&
    $auth.user.type !== 'Branch Manager'
  ) {
    return redirect('/')
  }
}
