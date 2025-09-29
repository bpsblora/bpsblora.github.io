// ==== Helper untuk sorting ====
            function sortById(arr, idField) {
              return arr.sort((a,b) => a.properties[idField].localeCompare(b.properties[idField]));
            }

            // ==== Isi dropdown Kecamatan ====
            let kecOptions = sortById(batas_kec.features,"idkec").map(f => ({
              id: f.properties.idkec,
              text: f.properties.idkec.substring(4, 7) + " - " + f.properties.nmkec
            }));
            $("#kecamatan").select2({
              data: kecOptions,
              placeholder:"Pilih Kecamatan",
              dropdownParent: $("#dropdownContent"),
              selectionCssClass: "select2-kec"   // <=== tambahkan ini
            });


            // ==== Event kecamatan -> filter desa ====
            $("#kecamatan").on("change", function() {
              let selected = $(this).val() || [];
              let desaFiltered = batas_desa.features.filter(f => selected.some(id => f.properties.iddesa.startsWith(id)));
              let desaOptions = sortById(desaFiltered,"iddesa").map(f => {
                // cari nama kec dari prefix
                let idkec = f.properties.iddesa.substring(0,7);
                let nmkec = batas_kec.features.find(k => k.properties.idkec===idkec)?.properties.nmkec || "";
                return {id:f.properties.iddesa, text:"["+f.properties.kddesa+"] "+nmkec+" - "+f.properties.nmdesa};
              });
              $("#desa").empty().select2({data: desaOptions, placeholder: "Pilih Desa",
              dropdownParent: $("#dropdownContent"),
              selectionCssClass: "select2-desa"});
              $("#sls").empty().select2({placeholder:"Pilih SLS"});
            });
            

            // ==== Event desa -> filter sls ====

            $("#desa").on("change", function() {

              let selected = $(this).val() || [];

              let slsFiltered = batas_sls.features.filter(f => selected.some(id => f.properties.idsls.startsWith(id)));

              let slsOptions = sortById(slsFiltered,"idsls").map(f => ({

                id: f.properties.idsls,

                text: "["+f.properties.kdsls+"] "+f.properties.nmdesa+" - "+f.properties.nmsls

              }));

              $("#sls").empty().select2({data: slsOptions, placeholder:"Pilih SLS",dropdownParent: $("#dropdownContent"),

              selectionCssClass: "select2-sls"});

            });
   




        




