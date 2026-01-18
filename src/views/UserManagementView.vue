<template>
  <div class="user-management">
    <h2>Gebruikersbeheer</h2>

    <Tabs value="users">
      <TabList>
        <Tab v-if="can('User.View')" value="users">Gebruikers</Tab>
        <Tab v-if="can('Role.View')" value="roles">Functies</Tab>
      </TabList>

      <TabPanels>
        <TabPanel v-if="can('User.View')" value="users">
          <UserList />
        </TabPanel>
        <TabPanel v-if="can('Role.View')" value="roles">
          <RoleList />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions'

const { can } = usePermissions()
</script>

<style scoped>
.user-management {
  padding: 1rem;
}
</style>
