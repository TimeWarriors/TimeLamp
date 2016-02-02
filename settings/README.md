settings.json - Innehåller alla lampor som objekt och kan få in en ny lampa när som helst.
                För att lägga till en ny lampa skapa ett objekt i arrayn. Exempel på lampor är
                blink och hue.

                Exempel:
                        [
                            {
                                "type": "blink",
                                "id": "Lägg till id på lampan"
                            },

                            {
                                "type": "hue",
                                "id": "Lägg till id på lampan",
                                "room": "Lägg till id på rum"
                            }
                        ]


settings.js - Scriptet innehåller en JSON parser funktion som läser av settings.json filen.
              Scriptet innehåller även tre funktioner som är GETS till Lampor.

getLamps(type)         - Denna funktionen tar in en type som kan vara blink eller hue.
                         Tar funktionen in något annat kommer den kasta felmedelande att
                         den inte kunde hitta typen.

                         Om man skickar in en valid typ så får man tilbaka alla lampor
                         som är av den här typen.

getLampsinRoom(roomId) - Denna funktionen tarin et rumId som kan vara vad som helst.
                         I testkoden används idt 105. Om ett id inte existerar så får
                         man tillbaka ett error som säger att rummet inte existerar.

                         Om man skickar in ett valit rumId så får man tillbaka alla lampor
                         som existerar i detta rum.

getIdOnLamps(lampId)   - Denna funktionen tar in en type som kan avra vad som helst.
                         I testkoden används idt XXX. Om ett id inte existerar så får
                         man tillbaka ett error som säger att lampan inte existerar.

                         Om man skickar in ett valit rumId så får man tillbaka alla lampor
                         som existerar på detta id.
