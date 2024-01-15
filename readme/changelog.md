# 13.01.2024

We added a PostgreSQL Database running inside a Docker container with a volume mounted on a 100GB drive. This should provide sufficient storage space for the foreseeable future. We will eventually add snapshot based backups of the HDD.
* Data loss is now much less likely to occur.
* If you have a backup of your data in a JSON file you can import it to restore your data. It will then be stored in the database.

# 28.08.2023

We fixed a lot of minor bugs in the application.

    * Import didn't work for when data contained lists without titles
    * Poor contrast with buttons when background turned on
    * Poppers had portals disabled leading
    * z-index issues
    * deleting the due time of an item didn't update the ui

We remodeled the UI to make it more like Google Keeps UI. This is to make lists in the next row visible on small screens.

# 21.08.2023

We updated the whole repository to reflect the state of the application at [https://state-less.cloud/lists](https://state-less.cloud/lists?fs).
