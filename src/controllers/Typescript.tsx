// function addUser1(user) {
//   return user.name.toUpperCase();
// }

// console.log(addUser({ age: 20 })); // Runtime error, no "name"


type User = { name: string; age: number };

function addUser(user: User): string {
  return user.name.toUpperCase();
}

// console.log(addUser({ age: 20 })); // ❌ Error in editor itself


// for react frontend - Js

// function Button({ label }) {
//   return <button>{label.toUpperCase()}</button>;
// }
// <Button />; // Runtime error if label missing

// react frontend - Ts
// type ButtonProps = { label: string };

// function Button({ label }: ButtonProps) {
//   return <button>{label.toUpperCase()}</button>;
// }

// { <Button />; // ❌ TS error: "label" is required */}


