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
              li.textContent = pdfFile;

              const viewButton = document.createElement('button');
              viewButton.textContent = 'Ver';
              viewButton.onclick = async () => {
                window.open(`/api/funciones/documentos/${pdfFile}`, '_blank');
                // const response = await fetch(`/api/funciones/documentos/${pdfFile}`);
                // const text = await response.text();
                // alert(text);
              };

              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Borrar';
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

  // Listar PDFs al cargar la página
  listPDFs();
});
