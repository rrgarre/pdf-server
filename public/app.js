document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const pdfList = document.getElementById('pdfList');

  // Función para listar PDFs
  const listPDFs = async () => {
      try {
          const response = await fetch('/api/funciones/listar');
          const pdfFiles = await response.json();
          pdfList.innerHTML = '';
          pdfFiles.forEach(pdfFile => {
              const li = document.createElement('li');
              // li.textContent = pdfFile;
              const linea = document.createElement('span')
              linea.classList.add('file-name')
              linea.textContent = decodeURIComponent(pdfFile)
              // linea.textContent = pdfFile;

              const viewButton = document.createElement('button');
              viewButton.classList.add("button-view")
              // viewButton.textContent = 'Ver';
              viewButton.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
              viewButton.onclick = async () => {
                window.open(`/api/funciones/documentos/${pdfFile}`, '_blank');
                // const response = await fetch(`/api/funciones/documentos/${pdfFile}`);
                // const text = await response.text();
                // alert(text);
              };

              const deleteButton = document.createElement('button');
              deleteButton.classList.add("button-delete")
              deleteButton.textContent = 'Borrar';
              deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
              deleteButton.onclick = async () => {
                  if (confirm(`¿Estás seguro de que deseas eliminar el archivo ${pdfFile}?`)) {
                      const response = await fetch(`/api/funciones/borrar/${pdfFile}`, {
                          method: 'GET'
                      });
                      if (response.ok) {
                          listPDFs();
                      } else {
                          alert('Error al borrar el PDF');
                      }
                  }
              };

              li.appendChild(linea)
              li.appendChild(viewButton);
              li.appendChild(deleteButton);
              pdfList.appendChild(li);
          });
      } catch (error) {
          console.error('Error al listar PDFs:', error);
      }
  };

  // Función para subir un PDF
  const uploadPDF = async (file) => {
      const formData = new FormData();
      formData.append('pdf', file);

      try {
          const response = await fetch('/api/funciones/subir', {
              method: 'POST',
              body: formData
          });
          if (response.ok) {
              listPDFs();
          } else {
              alert('Error al subir el PDF');
          }
      } catch (error) {
          console.error('Error al subir el PDF:', error);
      }
  };

  uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = fileInput.files[0];
      if (file) {
          await uploadPDF(file);
          fileInput.value = '';
      }
  });

  // Eventos para el área de "drag and drop"
  dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', async (event) => {
      event.preventDefault();
      dropZone.classList.remove('dragover');
      const files = event.dataTransfer.files;
      if (files.length > 0) {
          await uploadPDF(files[0]);
      }
  });

  // Codigo para copiar en portapapeles las urls
  const copyLinksButton = document.getElementById('copyLinksButton');
  copyLinksButton.addEventListener('click', async () => {
      try {
        console.log('antes del fetch...')
        const response = await fetch('/api/funciones/listarurlsarray');
        console.log('despues del fetch...')
        if (!response.ok) {
          throw new Error('Error al obtener los links');
        }
        console.log('despues del if...')
        const links = await response.json();
        const linksText = links.join('\n'); // Opcional: puedes ajustar el separador según cómo los devuelvas
        // Copiar al portapapeles
        navigator.clipboard.writeText(linksText)
          .then(() => {
              alert('Links copiados al portapapeles');
          })
          .catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
            alert('Error al copiar los links al portapapeles');
          });
      } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener los links');
      }
  });


  // Listar PDFs al cargar la página
  listPDFs();
});
