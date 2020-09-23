export default function({ $auth, redirect }) {
  if ($auth.user.type !== 'Main Admin') {
    return redirect('/')
  }
}
