import { useRouter } from 'next/router';

export default function logout() {
    // TODO: implement logging out (I assume it'll involve
    //       removing some kind of cookie?)
    console.log('Clicked Logout Button');

    // Redirect to login page (couldn't use router bc not a component?)
    window.location.href = '/';
}
