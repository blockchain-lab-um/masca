<template>
  <div class="about">
    <h1 id="title">About SSI Snap Demo</h1>
    <div class="template">
      <Button class="discord p-0" aria-label="Discord" @click="openPage('https://discord.com/invite/M5xgNz7TTF')">
        <i class="pi pi-discord px-2"></i>
        <span class="px-3">Discord</span>
      </Button>
      <Button class="twitter p-0" aria-label="Twitter" @click="openPage('https://mobile.twitter.com/blockchainlabum')">
        <i class="pi pi-twitter px-2"></i>
        <span class="px-3">Twitter</span>
      </Button>
      <Button class="github p-0" aria-label="Github" @click="openPage('https://github.com/blockchain-lab-um')">
        <i class="pi pi-github px-2"></i>
        <span class="px-3">Github</span>
      </Button>
      <Button class="linktree p-0" aria-label="Linktr.ee" @click="openPage('https://linktr.ee/blockchainlabum')">
        <i class="pi pi-list px-2"></i>
        <span class="px-3">Linktr.ee</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const openPage = (url: string) => {
  window.open(url, '_blank');
}
</script>

<style lang="scss" scoped>
.about {
  margin: 0 auto;
  max-width: 1000px;
  padding: 0 1rem;
}

#title {
  text-align: center;
}

.template {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;
}

.p-button {
  margin-right: 0.5rem;
}

.p-buttonset {
  .p-button {
    margin-right: 0;
  }
}

.sizes {
  .button {
    margin-bottom: 0.5rem;
    display: block;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.template .p-button i {
  line-height: 2.25rem;
}

.template .p-button.discord {
  background: linear-gradient(to left, var(--indigo-600) 50%, var(--indigo-700) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: background-position 0.5s ease-out;
  color: #fff;
  border-color: var(--indigo-700);
}

.template .p-button.discord:hover {
  background-position: left bottom;
}

.template .p-button.discord i {
  background-color: var(--indigo-700);
}

.template .p-button.discord:focus {
  box-shadow: 0 0 0 1px var(--indigo-400);
}

.template .p-button.twitter {
  background: linear-gradient(to left, var(--blue-400) 50%, var(--blue-500) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: background-position 0.5s ease-out;
  color: #fff;
  border-color: var(--blue-500);
}

.template .p-button.twitter:hover {
  background-position: left bottom;
}

.template .p-button.twitter i {
  background-color: var(--blue-500);
}

.template .p-button.twitter:focus {
  box-shadow: 0 0 0 1px var(--blue-200);
}

.template .p-button.github {
  background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: background-position 0.5s ease-out;
  color: #fff;
  border-color: var(--bluegray-800);
}

.template .p-button.github:hover {
  background-position: left bottom;
}

.template .p-button.github i {
  background-color: var(--bluegray-800);
}

.template .p-button.github:focus {
  box-shadow: 0 0 0 1px var(--bluegray-500);
}

.template .p-button.linktree {
  background: linear-gradient(to left, var(--green-200) 50%, var(--green-300) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: background-position 0.5s ease-out;
  color: #000;
  border-color: var(--green-300);
}

.template .p-button.linktree:hover {
  background-position: left bottom;
}

.template .p-button.linktree i {
  background-color: var(--green-300);
}

.template .p-button.linktree:focus {
  box-shadow: 0 0 0 1px var(--green-400);
}

@media screen and (max-width: 640px) {
  .p-button {
    margin-bottom: 0.5rem;

    &:not(.p-button-icon-only) {
      display: flex;
      width: 100%;
    }
  }

  .p-buttonset {
    .p-button {
      margin-bottom: 0;
    }
  }
}
</style>