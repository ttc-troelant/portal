<script setup lang="ts">
</script>

<template>
  <div class="user-management">
    <h2>Gebruikersbeheer</h2>

    <Tabs value="roles">
      <TabList>
        <Tab value="users">Gebruikers</Tab>
        <Tab value="roles">Functies</Tab>
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