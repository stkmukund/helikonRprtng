<script>
export default {
  data() {
    return {
      loading: false,
      campaignData: [],
      tableHead: tableHead,
      finalData: false,
      startDate: "",
      endDate: "",
      config: useRuntimeConfig().public,
      salesRefund: [],
    };
  },
  methods: {
    async handleClick() {
      if (!this.startDate && !this.endDate) return "";
      this.loading = true;
      await this.mLab();
      this.finalData = true;
      await this.checkoutChamp();
      await this.flexiHealth();
      await this.bankSites();
      this.loading = false;
    },

    async mLab() {
      let resposne = await $fetch(
        `/campaigns/m-lab/?startDate=${this.startDate}&endDate=${this.endDate}&type=front`,
        requestOptionsFront
      );
      this.campaignData.push(resposne);
      return resposne;
    },
    async checkoutChamp() {
      const resposne = await $fetch(
        `/campaigns/checkout-champ/?startDate=${this.startDate}&endDate=${this.endDate}&type=front`,
        requestOptionsFront
      );
      this.campaignData.push(resposne);
      return resposne;
    },
    async flexiHealth() {
      const resposne = await $fetch(
        `/campaigns/flexi-health/?startDate=${this.startDate}&endDate=${this.endDate}&type=front`,
        requestOptionsFront
      );
      this.campaignData.push(resposne);
      return resposne;
    },
    async bankSites() {
      const resposne = await $fetch(
        `/campaigns/bank-sites/?startDate=${this.startDate}&endDate=${this.endDate}&type=front`,
        requestOptionsFront
      );
      this.campaignData.push(resposne);
      return resposne;
    },

    // Formate date
    formatDate() {
      let value1 = this.startDate.replace(/\D/g, ""); // Remove all non-digit characters
      let value2 = this.endDate.replace(/\D/g, ""); // Remove all non-digit characters
      // for startDate
      if (value1.length >= 3 && value1.length <= 4) {
        this.startDate = value1.slice(0, 2) + "/" + value1.slice(2);
      } else if (value1.length >= 5) {
        this.startDate =
          value1.slice(0, 2) +
          "/" +
          value1.slice(2, 4) +
          "/" +
          value1.slice(4, 8);
      } else {
        this.startDate = value1;
      }

      // for endDate
      if (value2.length >= 3 && value2.length <= 4) {
        this.endDate = value2.slice(0, 2) + "/" + value2.slice(2);
      } else if (value2.length >= 5) {
        this.endDate =
          value2.slice(0, 2) +
          "/" +
          value2.slice(2, 4) +
          "/" +
          value2.slice(4, 8);
      } else {
        this.endDate = value2;
      }
    },
    customDecryptArray(encryptedArray, key) {
      return encryptedArray.map((encryptedItem) => {
        // Decode the Base64 encoded string first
        const decodedMessage = atob(encryptedItem);
        let decrypted = "";
        for (let i = 0; i < decodedMessage.length; i++) {
          decrypted += String.fromCharCode(
            decodedMessage.charCodeAt(i) ^ key.charCodeAt(i % key.length)
          );
        }
        return decrypted;
      });
    },
  },
  mounted() {},
};
</script>
<template>
  <main class="p-5">
    <div class="flex">
      <button
        @click="handleClick"
        :disabled="loading"
        type="button"
        class="max-w-48 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 focus:outline-none flex gap-2 items-center h-10"
      >
        Calculate
        <div v-if="loading">
          <Loading />
        </div>
      </button>
      <div class="date-inputs w-full">
        <input
          v-model="startDate"
          @input="formatDate"
          maxlength="10"
          placeholder="Start Date: MMDDYYYY"
          type="text"
          id="small-input"
          class="mr-3 w-2/12 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          v-model="endDate"
          @input="formatDate"
          maxlength="10"
          placeholder="End Date: MMDDYYYY"
          type="text"
          id="small-input"
          class="w-2/12 h-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xl focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Table -->
    <div v-if="!finalData">
      <TableLoading />
    </div>
    <div
      id="tableDiv"
      v-if="finalData"
      class="relative overflow-x-auto shadow-md sm:rounded-lg"
    >
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th
              v-for="(item, index) in tableHead"
              scope="col"
              class="px-6 py-3"
            >
              {{ tableHead[index] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in campaignData"
            :key="rowIndex"
            class="bg-white border-b hover:bg-gray-50"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {{ row[0] }}
            </th>
            <td class="px-6 py-4">{{ row[1] }}</td>
            <td class="px-6 py-4">${{ row[2] }}</td>
            <td class="px-6 py-4">{{ row[3] }}</td>
            <td class="px-6 py-4">{{ row[4] }}</td>
            <td class="px-6 py-4">{{ row[5] * 100 }}%</td>
            <td class="px-6 py-4">{{ row[6] }}</td>
            <td class="px-6 py-4">${{ row[7] }}</td>
            <td class="px-6 py-4">${{ row[8] }}</td>
            <td class="px-6 py-4">{{ row[9] * 100 }}%</td>
            <td class="px-6 py-4">${{ row[10] }}</td>
            <td class="px-6 py-4">${{ row[11] }}</td>
            <td class="px-6 py-4">${{ row[12] }}</td>
            <td class="px-6 py-4">{{ (row[13] * 100).toFixed(2) }}%</td>
            <td class="px-6 py-4">{{ row[14] * 100 }}%</td>
            <td class="px-6 py-4">{{ row[15] }}</td>
            <td class="px-6 py-4">{{ row[16] }}</td>
            <td class="px-6 py-4">{{ row[17] }}</td>
            <td class="px-6 py-4">{{ row[18] }}</td>
            <td class="px-6 py-4">{{ row[19] * 100 }}%</td>
            <td class="px-6 py-4">{{ row[20] }}</td>
            <td class="px-6 py-4">{{ row[21] }}</td>
            <td class="px-6 py-4">{{ row[22] }}</td>
            <td class="px-6 py-4">{{ row[23] * 100 }}%</td>
            <td class="px-6 py-4">{{ (row[24] * 100).toFixed(2) }}%</td>
            <td class="px-6 py-4">{{ row[25] }}</td>
            <td class="px-6 py-4">{{ row[26] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
