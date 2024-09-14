<script>
export default {
    data() {
        return {
            tableHead: tableHead,
        }
    }
}
</script>
<template>
    <div id="tableDiv" class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th v-for="(item, index) in tableHead" scope="col" class="px-6 py-3">{{ tableHead[index] }}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b hover:bg-gray-50">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <TableLoadingEffect />
                    </th>
                    <td class="px-6 py-4">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4 text-red-500">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4 text-red-500">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4 text-red-500">
                        <TableLoadingEffect />
                    </td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                    <td class="px-6 py-4"><TableLoadingEffect /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>