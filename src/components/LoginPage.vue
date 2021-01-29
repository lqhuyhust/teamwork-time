<template>
    <div class="w3-content">
        <h1 class="w3-center"><strong>Login form</strong></h1>
        <form class="w3-container login-form" @submit.prevent="handleSubmit">
            <div class="w3-section w3-center">
                <label><b>Username</b></label>
                <input v-model="username" class="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Username" name="username" required>
                <label><b>Password</b></label>
                <input v-model="password" class="w3-input w3-border" type="password" placeholder="Enter Password" name="password" required>
                <button class="w3-button w3-green w3-section w3-padding" type="submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
import {userService} from './../services/user.service'
import {router} from './../router/router'

export default {
    data () {
        return {
            username: '',
            password: ''
        }
    },
    created () {
        // reset login status
        userService.logout();
        localStorage.removeItem('token');
        console.log(localStorage.getItem('token'));
    },
    methods: {
        handleSubmit (e) {
            const { username, password } = this;
            if (username && password) {
                userService.login(username, password)
            }
        }
    }
};
</script>