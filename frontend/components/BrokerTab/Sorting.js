
export function sortData(data, tipe) {

  if (tipe == "score") {
    
    var filtered = data.sort((a, b) => {
      return a.analysis.totalRiskScore - b.analysis.totalRiskScore;
    });


   
  } else if (tipe == "place") {
    var filtered = data.sort((a, b) => {
      let fa = a.Name.toLowerCase();
      let fb = b.Name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  else if (tipe == "date"){
    var filtered = data.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.Date) - new Date(a.Date);
    });
  }


  

  return filtered
}
