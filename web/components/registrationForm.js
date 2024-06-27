import { handleUserCreationSubmit } from '../services/createUser.js';

export function RegistrationComponent() {
  const userCreationFormHTML = `
    <div id="registration-view">
      <form id="registrationForm">
        <input type="text" id="username" placeholder="Username" required />
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <input type="number" id="age" placeholder="Age" required />
        <select id="gender" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" id="firstName" placeholder="First Name" required />
        <input type="text" id="lastName" placeholder="Last Name" required />
        <button type="submit">Create User</button>
      </form>
    </div>
  `;

  setTimeout(() => {
    const userCreationForm = document.getElementById("registrationForm");
    if (userCreationForm) {
      userCreationForm.onsubmit = handleUserCreationSubmit;
    }
  }, 0);

  return userCreationFormHTML;
}
