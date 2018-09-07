<template>
  <div class="container">
    <h1>
      Data Privacy Statement
    </h1>

    <h2>
      Overview
    </h2>

    <p>
      This document explains what data TodoScheduler collects and how that data is used.
      It is valid for the TodoScheduler website at todoscheduler.org, the public API used by TodoScheduler, and for native clients (e.g., the Android TodoScheduler app).
    </p>
    <p>
      Responsible for this service is the person named in the
      <router-link
          :to="{ name: 'legalStatement' }">
        legal statement</router-link>.
    </p>

    <h2>
      Data Collected on Servers
    </h2>

    <p>
      TodoScheduler allows you to manage tasks and schedule them.
      Furthermore, additional information to increase the daily productivity can be collected using TodoScheduler.
    </p>
    <p>
      This data provided by the user through the functionality of TodoScheduler is stored on servers located in Germany.
      This enables you to use TodoScheduler on multiple devices and synchronize the data between the devices.
    </p>
    <p>
      Furthermore, meta data about your usage of TodoScheduler is collected in server log files.
      These comprise information about the software you use (e.g., your operating system and browser).
      Furthermore, a truncated version of your IP address is stored.
      Due to the truncation, this IP address can not be affiliated with you.
      It is required to store this anonymized IP address in order to debug and resolve problems in the operation of the service.
      In addition, these log records contain the time of your request. The log data is deleted after a month.
    </p>

    <h2>
      Data Stored Locally
    </h2>

    <p>
      In order to protect TodoScheduler, you need to log in to this service.
      When you do that, a unique authentication token is generated on the server that can be used by yourself to authenticate against the server.
      This token is stored in the local storage of your browser to be able to identify you when opening TodoScheduler in a new window or within a new browser session.
    </p>
    <p>
      Furthermore, to enhance the user experience, a copy of the data stored online that you create in TodoScheduler is also stored in the local storage of your browser.
      This allows TodoScheduler to present you the data from your last visit before requests to the server are finished.
    </p>
    <p>
      The program files of TodoScheduler are stored in the cache of your browser.
      This allows you to load TodoScheduler without downloading the complete application from the server every time you use TodoScheduler.
    </p>

    <h2>
      Additional Data Collection in Case of Failures
    </h2>

    <p>
      If server failures occur, additional data is captured.
      This may contain your full IP address (e.g., without the truncation described in the previous section), and the operation that you were trying to perform.
    </p>
    <p>
      This data is collected to be able to investigate and resolve the problem.
      After the problem is resolved, the associated data will be deleted.
    </p>

    <h2>
      Retention Period
    </h2>

    <p>
      The data you submit to TodoScheduler (e.g., tasks, scheduled tasks, notes, etc.) is kept until you actively delete it or request it to be deleted.
    </p>

    <p>
      Log data and request meta data is kept at most a month.
    </p>

    <h2>
      Encryption
    </h2>

    <p>
      Your connections to TodoScheduler’s servers is always encrypted using transport layer security (TLS).
    </p>

    <h2>
      Your Rights
    </h2>

    <p>
      You have the right to request information about the data TodoScheduler stores about you at any time.
      You also may request your data to be corrected, blocked, or deleted.
      You can find the necessary contact information in the
      <router-link
          :to="{ name: 'legalStatement' }">
        legal statement</router-link>.
    </p>

    <h2>
      Backups
    </h2>

    <p>
      The data stored on the servers is backed up daily to separate servers.
      These backups are fully encrypted before they are uploaded to the separate servers.
      These servers are located in Germany as well.
    </p>
  </div>
</template>

<script>
export default {
  name: 'DataPrivacyStatement'
}
</script>
