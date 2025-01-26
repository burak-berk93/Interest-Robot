<template>
    <div class="flex justify-center items-center h-screen">
      <div class="p-6 border rounded-lg shadow-lg w-80">
        <h1 class="text-xl font-bold text-center">Admin Giriş</h1>
        <form @submit.prevent="login">
          <input v-model="username" type="text" placeholder="Kullanıcı Adı" class="border p-2 w-full my-2" required />
          <input v-model="password" type="password" placeholder="Şifre" class="border p-2 w-full my-2" required />
          <button type="submit" class="bg-blue-500 text-white p-2 w-full">Giriş Yap</button>
        </form>
        <p v-if="errorMessage" class="text-red-500 mt-2 text-center">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  async function login() {
    try {
      const response = await $fetch('/api/auth', {
        method: 'POST',
        body: { username: username.value, password: password.value }
      });
  
      if (response.token) {
        localStorage.setItem('token', response.token); // Token'ı sakla
        router.push('/'); // Başarılıysa admin paneline yönlendir
      }
    } catch (error) {
      errorMessage.value = 'Giriş başarısız. Kullanıcı adı veya şifre yanlış!';
    }
  }
  </script>
  