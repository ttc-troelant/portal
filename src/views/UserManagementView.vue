<script setup lang="ts">
</script>

<template>
  <div class="user-management">
    <h2>User management</h2>

    <Tabs value="roles">
      <TabList>
        <Tab value="roles">Functies</Tab>
        <Tab value="users">Users</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="roles">
          <RoleList />
        </TabPanel>

        <TabPanel value="users">
          <p>Users management coming later.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>


<style scoped>
.user-management {
  padding: 1rem;
}
</style>