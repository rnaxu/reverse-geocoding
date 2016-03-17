# reverse-geocoding
<a href="https://developers.google.com/maps/documentation/javascript/">Google Maps Javascript API</a>
を使って緯度・経度から住所を取得する  
例 `東京都千代田区丸の内１丁目９−１`

## 手順

### 座標を渡して`results`を受け取る
```
var geocoder = new google.maps.Geocoder;

geocoder.geocode({'location': position}, function(results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    // resultsが返ってきたときの処理
  } else {
    // resultsが返ってこなかったときの処理
    window.alert('Geocoder failed due to: ' + status);
  }
});
```

### `results`が返ってきたとき
`results`は次のような構造のオブジェクトの集まり  
オブジェクトの個数は座標によってまちまち
```
address_components: Array[n]
formatted_address: String
geometry: Object
place_id: String
types: Array[n]
```
`東京都千代田区丸の内１丁目９−１`のような住所を取得するために必要な情報は`types`と`formatted_address`  

`results`の各オブジェクトの`types`を見て、`types`が`sublocality_level_~`だったらそのオブジェクトの`formatted_address`を使う
```
var address = '';
var resultLength = results.length;

for (var i = 0; i < resultLength; i++) {

    // typesがsublocality_level_~だったら
    if(results[i].types[0].match(/^sublocality_level_/)) {

        address = formatAddress(results[i].formatted_address);

        // マッチしたらfor文強制終了させる
        i = resultLength;
    }
}
```
`types`が`sublocality_level_~`のオブジェクトが存在しなかったら`types`が`premise`の`formatted_address`を使う  

`premise`も存在しない場合、期待する形の住所を生成できないので「No results found」とアラート
```
// typesにsublocality_level_~が存在しない場合
if(address === '') {
    if(results[0].types[0].match(/premise/)) { // typesがpremiseだったら
        address = formatAddress(results[0].formatted_address);
    } else { // それ以外
        window.alert('No results found');
    }
}
```
`formatted_address`は`"日本, 〒100-0005 東京都千代田区丸の内１丁目９−１"`のような形になっているので、日本と郵便番号を取り除く  
外国は今回対象としないので「No results found」とアラート
```
function formatAddress(originalAdd) {
  var formattedAdd = '';

  if(originalAdd.match(/^日本/)) { // 日本国内だったら

    // '日本'と郵便番号を取り除く
    formattedAdd = originalAdd.replace('日本, ', '').replace(/〒[0-9]{3}-[0-9]{4} /, '');

  } else { // 外国だったら
    window.alert('No results found');
  }

  return formattedAdd;
}
```
JSの詳細は<a href="https://github.com/rnaxu/reverse-geocoding/blob/master/src/js/map.js">こちら</a>