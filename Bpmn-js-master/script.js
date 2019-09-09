// modeler instance

var bpmnModeler = new BpmnJS({
  container: "#canvas",

  keyboard: {
    bindTo: window
  }
});

/**
  
       * Open diagram in our modeler instance.
  
       *
  
       * @param {String} bpmnXML diagram to display
  
       */
function diagramUrl(event) {
  if (event == null) {
    var diagram = "diagram.bpmn";
    $.get(diagram, openDiagram, "text");
  } else {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    $.get(tmppath, openDiagram, "text");
  }
}

function openDiagram(bpmnXML) {
  bpmnModeler.importXML(bpmnXML, function(err) {
    if (err) {
      return console.error("could not import BPMN 2.0 diagram", err);
    }

    // access modeler components

    var canvas = bpmnModeler.get("canvas");

    var overlays = bpmnModeler.get("overlays");

    // zoom to fit full viewport

    canvas.zoom("fit-viewport");

    // attach an overlay to a node

    overlays.add("SCAN_OK", "note", {
      position: {
        bottom: 0,

        right: 0
      },

      html: '<div class="diagram-note">Mixed up the labels?</div>'
    });

    // add marker

    canvas.addMarker("SCAN_OK", "needs-discussion");
  });
}

function download_diagram() {
  bpmnModeler.saveXML({ format: true }, function(err, xml) {
    if (err) {
      return console.error("could not save BPMN 2.0 diagram", err);
    }

    var x = prompt("digite o nome do arquivo");

    if (x == null) {
      alert("Download cancelado");
    } else {
      var filename = x + ".bpmn";
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(xml)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  });
}

// load external diagram file via AJAX and open it
//$.get(diagramUrl(), openDiagram, 'text')

diagramUrl();

document
  .getElementById("importar")
  .addEventListener("change", diagramUrl, false);

function openCloseNav() {
  if (document.getElementById("sideMenuContainer").style.width == "500px") {
    document.getElementById("sideMenuContainer").style.width = "0";
  } else {
    document.getElementById("sideMenuContainer").style.width = "500px";
  }
}

function teste() {
  var elementRegistry = bpmnModeler.get("elementRegistry");
  var modeling = bpmnModeler.get("modeling");
  // var elements = elementRegistry.filter(function(element) {
  //   return element, "bpmn:UserTask";
  // });
  var startEventShape = elementRegistry.get(
    document.getElementById("inputID").value
  );
  modeling.updateProperties(startEventShape, {
    name: document.getElementById("inputName").value,
    comments: document.getElementById("inputDesc").value,
  });
}
