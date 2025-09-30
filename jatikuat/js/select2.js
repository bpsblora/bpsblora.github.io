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

  // Siapkan array kosong untuk opsi
  let slsOptions = [];

  // Loop tiap desa terpilih
  selected.forEach((desaId, index) => {
    let slsFiltered = batas_sls.features.filter(f =>
      f.properties.idsls.startsWith(desaId)
    );

    // Tambahkan opsi "Semua SLS Desa X"
    let namaDesa = slsFiltered.length > 0 ? slsFiltered[0].properties.nmdesa : desaId;
    slsOptions.push({
      id: "all_" + desaId,
      text: "▶ SEMUA SLS DI DESA " + namaDesa
    });

    // Tambahkan daftar SLS
    slsOptions = slsOptions.concat(
      sortById(slsFiltered, "idsls").map(f => ({
        id: f.properties.idsls,
        text: "[" + f.properties.kdsls + "] " + f.properties.nmdesa + " - " + f.properties.nmsls
      }))
    );

    // Kalau bukan desa terakhir, tambahkan separator
    if (index < selected.length - 1) {
      slsOptions.push({
        id: "sep_" + desaId,
        text: "---",   // placeholder
        disabled: true
      });
    }
  });

  // Isi dropdown sls
  $("#sls").select2({
    data: slsOptions,
    placeholder: "Pilih SLS",
    dropdownParent: $("#dropdownContent"),
    selectionCssClass: "select2-sls",
    templateResult: function (data) {
      if (!data.id) return data.text; // placeholder
      
      if (data.id.startsWith("all_")) {
        return $('<span><strong>' + data.text + '</strong></span>');
      }
      
      if (data.id.startsWith("sep_")) {
        return $('<hr style="margin:4px 0; border-top:1px solid #828282;">');
      }

      return data.text;
    }
  });
});



// ==== Event untuk handle "Semua Desa X" ====
$("#sls").on("select2:select", function(e) {
  let id = e.params.data.id;

  if (id.startsWith("all_")) {
    let desaId = id.replace("all_", "");

    // Ambil semua option yang milik desaId ini
    let allIds = $("#sls option").map(function() {
      let val = $(this).val();
      return val.startsWith(desaId) ? val : null;
    }).get().filter(v => v);

    // Set agar semua terpilih
    let current = $("#sls").val() || [];
    $("#sls").val([...new Set([...current, ...allIds])]).trigger("change");
  }
});


        





