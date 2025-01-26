<template>
    <div class="flex justify-center pt-11">
        <div class="card card-side bg-base-100 shadow-xl w-[1000px] border-2 border-x-gray-200">
            <figure>
                <img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp" alt="Movie" />
            </figure>
            <div class="grid grid-cols-3 gap-4 pl-4 pt-8 ">
                <div class="...">
                    <p>Present Value (Capital)</p>
                </div>
                <div class="col-span-2" :class="{ 'tooltip': showTooltip.presentCapital }" data-tip="Please enter a valid number. Letters, special characters (except . for decimals), and empty values are not allowed.">
                    <input type="text" placeholder="Type here" v-model="formValues.presentCapital"
                         @keypress="allowNumbersAndDot($event, 'presentCapital')"  class="input input-bordered input-info w-full" />
                </div>
  

                
                <div class="...">Interest Rate</div>
                <div class="" :class="{ 'tooltip': showTooltip.interestRate }" data-tip="Please enter a valid number. Letters, special characters (except . for decimals), and empty values are not allowed.">
                    <input type="text" placeholder="Type here" v-model="formValues.interestRate"
                        @keypress="allowNumbersAndDot($event, 'interestRate')"  class="input input-bordered input-info w-full" />
                </div>
                <div class="...">
                    <select class="select select-info w-full max-w-xs" v-model="selectRateArray">
                        <option disabled selected>Seçiniz</option>
                        <option v-for="item in rateArray" :key="item" :value="item">{{ item }} </option>
                    </select>
                </div>
                <div class="...">Term</div>
                <div class="..." :class="{ 'tooltip': showTooltip.termValue }" data-tip="Please enter a valid number. Letters, special characters (except . for decimals), and empty values are not allowed."><input type="text" placeholder="Type here" v-model="formValues.termValue"
                         @keypress="allowNumbersAndDot($event, 'termValue')"  class="input input-bordered input-info w-full" /></div>
                <div class="...">
                    <select class="select select-info w-full max-w-xs" v-model="selectTermArray">
                        <option disabled selected>Seçiniz</option>
                        <option v-for="item in termArray" :key="item" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="grid grid-cols-subgrid gap-4 col-span-3 justify-items-end ">
                    <div class="col-start-4"><button class="btn btn-neutral" :disabled="buttonDisabled()" @click="interestCalculation()">Calculate</button></div>
                </div>
                <div class="col-span-3 pb-4">
                    <div role="alert" class="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="stroke-info h-6 w-6 shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>If you invested ${{ formValues.presentCapital }} now, {{ selectTermArray }} {{ formValues.termValue }} later, you get <b>{{ resultValue }}</b></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const formValues = ref({
  presentCapital: '',
  interestRate: '',
  termValue: '',
});
const showTooltip = ref({
  presentCapital: false,
  interestRate: false,
  termValue: false
});
const rateArray = ['Yearly', 'Monthly', 'Daily'];
const selectRateArray = ref("");
const termArray = ['Year', 'Month', 'Day'];
const selectTermArray = ref("");
const resultValue = ref(0);

// Sayfa yüklendiğinde kontrol yap
onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login'); // Giriş yapılmamışsa login sayfasına yönlendir
  }
});

function allowNumbersAndDot(event, field) {
  const charCode = event.charCode || event.keyCode;
  const key = String.fromCharCode(charCode);

  // Sadece rakamlar ve nokta karakterine izin ver
  if (!/^\d*\.?\d*$/.test(key)) {
    event.preventDefault(); // Geçersiz karakteri engelle
    showTooltip.value[field] = true;
  } else {
    showTooltip.value[field] = false;
  }
}



function interestCalculation() {
  const presentCapital = parseFloat(formValues.value.presentCapital);
  const interestRate = parseFloat(formValues.value.interestRate);
  
  // Eğer değerler geçersizse işlem yapma
  if (isNaN(presentCapital) || isNaN(interestRate) || isNaN(computedTermValue())) {
    resultValue.value = 0; // Hatalı giriş olduğu için sonucu sıfırla
    return;
  }

  // Hesaplamayı yap
  resultValue.value = parseFloat((presentCapital * Math.pow(1 + (interestRate * 0.01), computedTermValue())).toFixed(2));
  
  console.log(formValues.value.presentCapital, formValues.value.interestRate, formValues.value.termValue, selectRateArray.value, selectTermArray.value); // Burada doğru şekilde loglama yapıyoruz
}



function buttonDisabled() {
  console.log(formValues.value.presentCapital, formValues.value.interestRate, formValues.value.termValue, selectRateArray.value, selectTermArray.value);
  return !(
    formValues.value.presentCapital &&
    formValues.value.interestRate &&
    formValues.value.termValue &&
    selectRateArray.value &&
    selectTermArray.value
  );
}


function computedTermValue() {
  if (selectRateArray.value === 'Yearly') {
    if (selectTermArray.value === 'Year') {
      return formValues.value.termValue;
    } else if (selectTermArray.value === 'Month') {
      return formValues.value.termValue / 12;
    } else {
      return formValues.value.termValue / 360;
    }
  } else if (selectRateArray.value === 'Monthly') {
    if (selectTermArray.value === 'Year') {
      return formValues.value.termValue * 12;
    } else if (selectTermArray.value === 'Month') {
      return formValues.value.termValue;
    } else {
      return formValues.value.termValue / 30;
    }
  } else {
    if (selectTermArray.value === 'Year') {
      return formValues.value.termValue * 360;
    } else if (selectTermArray.value === 'Month') {
      return formValues.value.termValue * 30;
    } else {
      return formValues.value.termValue;
    }
  }
}




watch(formValues, (newValues, oldValues) => {
  Object.keys(newValues).forEach((key) => {
    if (!/^\d*\.?\d*$/.test(newValues[key])) { 
      showTooltip.value[key] = true;
      formValues.value[key] = oldValues[key]; // Hatalı giriş olursa eski değere geri al
      setTimeout(() => showTooltip.value[key] = false, 6000); // Tooltip 6 saniye sonra kaybolsun
    }
  });
  console.log(newValues); // Yeni formValues değerlerini logluyoruz
}, { deep: true });



</script>
