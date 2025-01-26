<template>
    <div>
        ss
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Sayfa yüklendiğinde kontrol yap
onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login'); // Giriş yapılmamışsa login sayfasına yönlendir
  }
});
</script>
