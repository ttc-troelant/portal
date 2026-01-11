<script setup lang="ts">
</script>

<template>
  <div class="user-management">
    <h2>Gebruikersbeheer</h2>

    <Tabs value="users">
      <TabList>
        <Tab value="users">Gebruikers</Tab>
        <Tab value="roles">Functies</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="users">
          <UserList />
        </TabPanel>
        <TabPanel value="roles">
          <RoleList />
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