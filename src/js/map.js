(function() {

  /**
   * Mapクラス
   */
  var Map = function(options) {
    this.gmap = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: options.lat,
        lng: options.lng
      },
      zoom: options.zoom
    });
    this.infowindows = [];
  };

  // 地図のイベントをまとめたやつ
  Map.prototype.mapEvent = function() {
    var _this = this;
    var loadFlag;

    // 地図の中心が動いた時
    this.gmap.addListener('center_changed', function() {
      clearTimeout(loadFlag);
      loadFlag = setTimeout(function(){
        var position = _this.getCenteLatLng();
        _this.getAddress(position);
      }, 1000);
    });

    // 地図がクリックされた時
    this.gmap.addListener('click', function() {
      for(var i = 0; i < _this.infowindows.length; i++) {
        _this.infowindows[i].close();
      }
    });
  };

  // GoogleMapの中心の緯度と経度を取得
  Map.prototype.getCenteLatLng = function() {
      var centerLtLn = this.gmap.getCenter();
      return {
          lat: centerLtLn.lat(),
          lng: centerLtLn.lng()
      };
  };

  // 座標から住所を取得
  Map.prototype.getAddress = function(latLng) {
    var _this = this;
    var geocoder = new google.maps.Geocoder;
    var position = {
        lat: latLng.lat,
        lng: latLng.lng
    };
    geocoder.geocode({'location': position}, function(results, status) {

      if (status === google.maps.GeocoderStatus.OK) {
        var address = '';
        var resultLength = results.length;

        for (var i = 0; i < resultLength; i++) {

            // typesがsublocality_level_~だったら
            if(results[i].types[0].match(/^sublocality_level_/)) {

                address = _this.formatAddress(results[i].formatted_address);

                // マッチしたらfor文強制終了させる
                i = resultLength;
            }
        }

        // typesにsublocality_level_~が存在しない場合
        if(address === '') {
            if(results[0].types[0].match(/premise/)) {　// typesがpremiseだったら
                address = _this.formatAddress(results[0].formatted_address);
            } else { // それ以外
                window.alert('No results found');
            }
        }

        _this.showInfoWindow(address, position);

      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });

  };

  // GoogleMapから返ってきた住所を使いやすいように編集
  Map.prototype.formatAddress = function(originalAdd) {
    var _this = this;
    var formattedAdd = '';

    if(originalAdd.match(/^日本/)) { // 日本国内だったら

      // '日本'と郵便番号を取り除く
      formattedAdd = originalAdd.replace('日本, ', '').replace(/〒[0-9]{3}-[0-9]{4} /, '');

    } else { // 外国だったら
      window.alert('No results found');
    }

    return formattedAdd;
  };

  // インフォウィンドウを表示
  Map.prototype.showInfoWindow = function(contentString, latLng) {
    this.infowindow = new google.maps.InfoWindow({
      content: contentString,
      position: latLng
    });
    this.infowindows.push(this.infowindow);
    this.infowindow.open(this.gmap);
  };


  /**
   * 実行部分
   */
  var options = {
    lat: 35.681382,
    lng: 139.766084,
    zoom: 15
  };

  // Mapをインスタンス化
  var map = new Map(options);
  map.getAddress(options);
  map.mapEvent();

})();