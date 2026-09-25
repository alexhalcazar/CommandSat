export const createUserService = (userRepository) => ({
    newUser: (username, email, passwordHash) =>
        userRepository.createUser(username, email, passwordHash),
    findByUserId: (id) => userRepository.findByUserId(id),
    findUserByEmail: (email) => userRepository.findUserByEmail(email),
    activeSwitch: (id) => userRepository.activeSwitch(id),
});
