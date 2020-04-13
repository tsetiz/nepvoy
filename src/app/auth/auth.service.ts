import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {User} from './user';

@Injectable()
export class AuthService {

  userData: any;

  constructor(private fireAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router) {
    // this.fireAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //   } else {
    //     localStorage.setItem('user', null);
    //   }
    // });
  }

  signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
      .then(result => {
        this.router.navigate(['dashboard']);
      }).catch(error => window.alert(error.message));
  }


  signUp(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        if (response.user != null) {
          response.user.sendEmailVerification().then(() => this.router.navigate(['verify-email']));
        }
      });
  }

  // Setting up user data when sign in with username/password,
  // sign up with username/password and sign in with social auth
  // provider in Firestore database using AngularFirestore + AngularFirestoreDocument service
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

}
