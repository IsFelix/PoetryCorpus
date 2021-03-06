$(function() {
    $(document).ready(function(){
        VOWELS = "aeiouAEIOUаоэиуыеёюяАОЭИУЫЕЁЮЯ";
        var diffs = {};

        addToSet = function(id) {
            if (!diffs[id]) {
                diffs[id] = true
            } else {
                delete diffs[id]
            }
        };

        $(document).on('click','.syllable',function(){
            var id = this.id;
            var line_id = id.split('-')[0];
            var word_id = id.split('-')[0] + '-' + id.split('-')[1];
            var text = $(this).text();
            var accented = $(this).hasClass('green') && $(this).hasClass('bck');
            if( !accented ) {
                var accent = -1;
                for (var i = 0; i < text.length; i++) {
                    if (VOWELS.indexOf(text[i]) != -1) {
                        accent = i;
                        break;
                    }
                }
                var accent_elems = $('#' + word_id).find('.bck.green,.bck.red');
                if (accent_elems.length) {
                    accent_elems.each(function (index) {
                        var removing_id = $(this)[0].id;
                        addToSet(removing_id);
                        $(this).removeClass('green');
                        $(this).removeClass('red');
                        $(this).addClass('default');
                    });
                }
                $(this).removeClass('default');
                $(this).addClass('green');
                addToSet(id);
            } else {
                $(this).removeClass('green');
                $(this).addClass('default');
                addToSet(id);
            }
            console.log(diffs)
        });

        $(".markup-selector").ready(function() {
            if( window.location.href.indexOf('markup') !== -1 ){
                var elems = window.location.href.split('/');
                $('.markup-selector option[value=' + elems[elems.length - 2] + ']').attr('selected','selected');
            } else {
                $('.markup-selector option[value=0]').attr('selected','selected');
            }
        });


        $(".markup-selector").change(function() {
            $( ".markup-selector option:selected" ).each(function() {
                var id = $(this).val();
                var href = "";
                if( id != 0 ) {
                    href = "/corpus/markups/" + id;
                } else{
                    href = "/corpus/poems/" + $(".poem")[0].id;
                }
                window.location.replace(href)
            });
        });

        $(document).on('click','.send-markup',function(){
            $.ajax({
                type: 'POST',
                url: window.location.href,
                data: {
                    'diffs[]': Object.keys(diffs),
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val()
                },
                success: function(response) {
                    window.location.replace(response.url)
                },
                error: function(request, status, error) {
                    console.log(error)
                }
            });
        });

        $(document).on('click','.compare',function(){
            var standard_pk = $(".standard").val();
            var test_pk = $(".test").val();
            console.log(standard_pk, test_pk);
            var href = "/corpus/comparison?test=" + test_pk + "&standard=" + standard_pk + "&document=" + $("#poem_pk").text();
            $.ajax({
                type: 'GET',
                url: window.location.href,
                success: function(response) {
                    window.location.replace(href)
                },
                error: function(request, status, error) {
                    console.log(error)
                }
            });
        });
    });
});