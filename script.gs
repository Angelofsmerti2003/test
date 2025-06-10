function doGet(e) {
  const response = ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'CORS request handled'
  }));
  response.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Handle both form data and quiz results
    const row = [
      new Date(), // Timestamp
      data.familiya || '',
      data.ism || '',
      data.telefon || '',
      data.uy_telefon || '',
      data.yonalish || '',
      data.ingliz_daraja || '',
      data.talim_turi || '',
      data.lavozim || '',
      data.rus_daraja || '',
      data.sertifikat || '',
      data.study_russia || '',
      data.why_study || '',
      data.why_study_top || '',
      JSON.stringify(data.subjects || []), // Subjects array
      data.testResults || '', // Quiz results
      data.totalScore || '' // Total score
    ];
    
    // Remove any empty values
    const cleanRow = row.map(cell => cell || '');
    
    // Append data as a row
    sheet.appendRow(cleanRow);

    const response = ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data submitted successfully'
    }));
    return response.setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    const response = ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
    return response.setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight requests
function doHead(e) {
  const response = ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'CORS preflight handled'
  }));
  return response.setMimeType(ContentService.MimeType.JSON);
}