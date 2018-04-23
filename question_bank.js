const OPTION_SEPARATOR = "##";
const OS = OPTION_SEPARATOR;
let conceptSet = [
    {
        "title": "宗教",
        "link": "",
        "questions": [],
        "subClass": [
            {
                "title": "青山宮",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/religion\/bluemountain.html",
                "questions": [
                    {
                        "ques_id": 1,
                        "question": "農曆十月二十二是青山王誕辰，有為期三天的神明遶境活動，俗稱「萬華大拜拜」。請問「萬華大拜拜」是哪一座宮廟的活動？",
                        "answer": "青山宮",
                        "other_options": "龍山寺##祖師廟",
                        "keyword": "宗教、青山宮"
                    }
                ]
            },
            {
                "title": "原鄉信仰",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/religion\/belief.html",
                "questions": [
                    {
                        "ques_id": 21,
                        "question": "下列哪一間廟宇與漢人移民的原鄉信仰無關？",
                        "answer": "西本願寺",
                        "other_options": "龍山寺##青山宮",
                        "keyword": "萬華、宗教、原鄉信仰"
                    },
                    {
                        "ques_id": 23,
                        "question": "請問下列何者不是「臺北三大廟門」？",
                        "answer": "行天宮",
                        "other_options": "艋舺清水祖師廟##萬華龍山寺",
                        "keyword": "萬華、宗教、原鄉信仰"
                    }
                ]
            },
            {
                "title": "基督宗教",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/religion\/christan.html",
                "questions": [
                    {
                        "ques_id": 22,
                        "question": "小裕和小裕的家人是生活在萬華貴陽街附近的基督教家庭，除了星期日的禮拜，教會的團契、祈禱會等活動也都會出席。請問小裕一家人最有可能到哪間教會？",
                        "answer": "艋舺教會",
                        "other_options": "赤峰教會##松山教會",
                        "keyword": "萬華、宗教、基督宗教"
                    }
                ]
            },
            {
                "title": "龍山寺",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/religion\/longshan.html",
                "questions": [
                    {
                        "ques_id": 20,
                        "question": "位於龍山寺旁的青草巷，因為聚集了販賣各式青草的店家而得名。請問青草巷的出現與下列何者最有關係？",
                        "answer": "早期寺廟提供的藥籤服務",
                        "other_options": "萬華為青草藥材的種植地##比較多人使用青草藥",
                        "keyword": "萬華、宗教、龍山寺"
                    },
                    {
                        "ques_id": 36,
                        "question": "此廟為臺灣三級古蹟，與艋舺龍山寺、大龍峒保安宮合稱台北三大廟門，請問此廟為?",
                        "answer": "艋舺清水巖祖師廟",
                        "other_options": "青山宮##地藏王廟",
                        "keyword": "萬華、建築、宗教寺廟"
                    },
                    {
                        "ques_id": 45,
                        "question": "接近龍山寺的一條小巷中，充滿著一股青草香，有十來家藥草商店聚集於此，歷史十分悠久，人們稱此地為",
                        "answer": "青草巷",
                        "other_options": "求藥巷##草藥巷",
                        "keyword": "萬華、生活、多樣產業"
                    }
                ]
            }
        ]
    },
    {
        "title": "歷史",
        "link": "",
        "questions": [],
        "subClass": [
            {
                "title": "西門紅樓",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/redbuilding.html",
                "questions": [
                    {
                        "ques_id": 28,
                        "question": "「這棟建築是台灣第一座官方興建的公營市場，建築以「八卦」造型為市場入口，代表八方雲集之意作；而「十字架」造型則是市場主體的特色。在政府及各個單位的努力經營下，現在又成為西區的指標性景點。」請問這裡最有可能是萬華的哪個地方？",
                        "answer": "西門紅樓",
                        "other_options": "第一蔬果批發市場##環南市場",
                        "keyword": "萬華、歷史、西門紅樓"
                    },
                    {
                        "ques_id": 41,
                        "question": "此建築位於西門町，興建完成迄今已逾百年，原是臺灣第一座官方興建的公營市場，現在為全台保存最完整的三級古蹟，是一座以紅磚所打造成的八角牆樓，請問此樓為?",
                        "answer": "西門紅樓",
                        "other_options": "萬華八角紅樓##艋舺紅磚樓",
                        "keyword": "萬華、建築、西門紅樓"
                    }
                ]
            },
            {
                "title": "夜市",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/nightmarket.html",
                "questions": [
                    {
                        "ques_id": 29,
                        "question": "「夜市入口處為傳統牌樓建築，兩側掛滿紅色宮燈，極具特色。除了著名的蛇店和老字號店家，這幾年並有腳底按摩等休閒業在此開設分店以服務觀光客。」請問這裡是那個地方的介紹？",
                        "answer": "華西街夜市",
                        "other_options": "中原市場##南機場夜市##艋舺夜市",
                        "keyword": "萬華、歷史、夜市"
                    },
                    {
                        "ques_id": 44,
                        "question": "其位於華西街的觀光夜市，以小吃為主，尤以遠近馳名的蛇肉、蛇湯為觀光客所知，因此獲得什麼稱號？",
                        "answer": "蛇街",
                        "other_options": "補藥街##小吃街",
                        "keyword": "萬華、生活、食物相關"
                    }
                ]
            },
            {
                "title": "重要設施",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/important.html",
                "questions": [
                    {
                        "ques_id": 26,
                        "question": "清代臺北盆地內最大的灌溉設施為下列何者？",
                        "answer": "瑠公圳",
                        "other_options": "八堡圳##曹公圳",
                        "keyword": "萬華、歷史、重要設施"
                    }
                ]
            },
            {
                "title": "剝皮寮",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/bopiliao.html",
                "questions": [
                    {
                        "ques_id": 30,
                        "question": "下列關於剝皮寮的敘述何者有誤？",
                        "answer": "現在的剝皮寮街區仍有民眾居住生活",
                        "other_options": "剝皮寮街區經過修整改建後，現在轉型成展覽場地。##這裡在日治後期被列為老松國小的校地預定地且不能增建改建，街區建築的特色因此被保留。",
                        "keyword": "萬華、歷史、剝皮寮"
                    },
                    {
                        "ques_id": 35,
                        "question": "請問以下哪一個地點直至現今仍保有清代漢人街道風貌?",
                        "answer": "剝皮寮",
                        "other_options": "廣州街##青草巷",
                        "keyword": "萬華、建築、剝皮寮"
                    }
                ]
            },
            {
                "title": "頂下郊拚",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/under.html",
                "questions": [
                    {
                        "ques_id": 24,
                        "question": "萬華以前被稱為「艋舺」，請問這個名稱原來的意思是什麼？",
                        "answer": "凱達格蘭族的獨木舟",
                        "other_options": "卑南族的花環##薩奇萊雅族的青年集會所",
                        "keyword": "萬華、歷史、頂下郊拚"
                    },
                    {
                        "ques_id": 25,
                        "question": "艋舺地區由興盛轉為沒落，與下列何者無關？",
                        "answer": "艋舺臨近淡水河，因而成為台北盆地貨物的集散中心",
                        "other_options": "河川泥沙淤積以及改道，使商船無法進入艋舺##居民的械鬥事件頻傳，導致市況日趨凋敝",
                        "keyword": "萬華、歷史、頂下郊拚"
                    },
                    {
                        "ques_id": 27,
                        "question": "在萬華的歷史中，曾經發生過一起械鬥事件，械鬥勝利的一方得到在艋舺地區的商業利益，而落敗的一方則遷往大稻埕生活定居。請問上文描述指的是哪一起械鬥？",
                        "answer": "頂下郊拚",
                        "other_options": "閩粵械鬥##漳泉械鬥",
                        "keyword": "萬華、歷史、頂下郊拚"
                    },
                    {
                        "ques_id": 33,
                        "question": "下列關於「頂下郊拚」的敘述何者與事實不符？",
                        "answer": "結果同安人械鬥失敗而移居艋舺，促成艋舺開發",
                        "other_options": "這場械鬥起因於艋舺的商業利益##這是一起三邑人與同安人的衝突事件",
                        "keyword": "萬華、歷史、頂下郊拚"
                    }
                ]
            },
            {
                "title": "愛愛院",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/love.html",
                "questions": [
                    {
                        "ques_id": 31,
                        "question": "「這裡隱身於萬華的巷弄中，原先設立的宗旨是收容生活貧苦、無人照顧的街友，隨著時間過去，這裡漸漸轉型成老人長照機構，許多無法自理生活的老人會被送到這裡接受照顧。」請問上文中可能是哪個地方的介紹？",
                        "answer": "愛愛院",
                        "other_options": "義光育幼院##西門紅樓",
                        "keyword": "萬華、歷史、愛愛院"
                    }
                ]
            },
            {
                "title": "製糖相關",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/history\/sugar.html",
                "questions": [
                    {
                        "ques_id": 32,
                        "question": "臺灣的現代化建設從清朝後期開始，而日治時期的建設更是為臺灣的發展奠下基礎。在製糖業的發展也是如此，萬華因為有鐵路的連結與水路的地利之便而擁有北臺灣第一座製糖廠，請問是下列那一座製糖廠？",
                        "answer": "臺北製糖廠",
                        "other_options": "臺南製糖廠##臺中製糖廠",
                        "keyword": "萬華、歷史、製糖相關"
                    }
                ]
            }
        ]
    },
    {
        "title": "生活",
        "link": "",
        "questions": [],
        "subClass": [
            {
                "title": "多樣產業",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/life\/diversity.html",
                "questions": [
                    {
                        "ques_id": 45,
                        "question": "接近龍山寺的一條小巷中，充滿著一股青草香，有十來家藥草商店聚集於此，歷史十分悠久，人們稱此地為",
                        "answer": "青草巷",
                        "other_options": "求藥巷##草藥巷",
                        "keyword": "萬華、生活、多樣產業"
                    },
                    {
                        "ques_id": 46,
                        "question": "某服飾商圈鄰近萬華車站，在大理街成立臺灣第一座成衣銷售批發廠，為成衣業的發源地，在大理街形成許多家服飾店，得到甚麼稱號?",
                        "answer": "艋舺服飾商圈",
                        "other_options": "五分埔商圈##萬華成衣商圈",
                        "keyword": "萬華、生活、多樣產業"
                    },
                    {
                        "ques_id": 47,
                        "question": "此街為專賣各種鳥類及相關產品的店面所聚集之處，在禽流感以及SARS爆發的時候，許多民眾對此地避而遠之，請問此街名稱為何？",
                        "answer": "鳥店街",
                        "other_options": "商店街##鳥類街",
                        "keyword": "萬華、生活、多樣產業"
                    },
                    {
                        "ques_id": 48,
                        "question": "萬華地區除了佛具店、香燭店與金紙店外，尚存有一些堅持傳統手工製造的老店舖，在現今快失傳的傳統手工業中，碩果僅存，請問下列哪些為其中之一?",
                        "answer": "全部皆是",
                        "other_options": "竹蒸籠##繡花鞋",
                        "keyword": "萬華、生活、多樣產業"
                    }
                ]
            },
            {
                "title": "食物相關",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/food1.html",
                "questions": [
                    {
                        "ques_id": 44,
                        "question": "其位於華西街的觀光夜市，以小吃為主，尤以遠近馳名的蛇肉、蛇湯為觀光客所知，因此獲得什麼稱號？",
                        "answer": "蛇街",
                        "other_options": "補藥街##小吃街",
                        "keyword": "萬華、生活、食物相關"
                    }
                ]
            },
            {
                "title": "萬華地域",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/life\/place.html",
                "questions": []
            },
            {
                "title": "萬華區花",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/flower1.html",
                "questions": [
                    {
                        "ques_id": 43,
                        "question": "此花的花語為少女情懷，亦代表著艋舺早期哀而不怨的鄉土情懷，因此被選為萬花區的區花，請問此花為下列那一種花？",
                        "answer": "白牡丹",
                        "other_options": "野牡丹##玫瑰",
                        "keyword": "萬華、生活、萬華區花"
                    }
                ]
            },
            {
                "title": "儀式活動",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/life\/ceremony.html",
                "questions": [
                    {
                        "ques_id": 49,
                        "question": "保儀大夫繞境活動是萬華一年一度的宗教盛會，以鑼鼓陣、舞獅等各方陣頭進行繞境，此活動特色稱為「加蚋文化節」。",
                        "answer": "O",
                        "other_options": "X",
                        "keyword": "萬華、生活、儀式活動"
                    },
                    {
                        "ques_id": 50,
                        "question": "「華江溼地守護聯盟」希望藉由此一年一度的活動，吸引更多關心華江溼地環境的朋友們，一同來參與華江溼地的經營管理、共同形塑華江溼地自然生態永續的未來願景。請問此活動為?",
                        "answer": "華江雁鴨季",
                        "other_options": "艋舺濕地維護季##賞鳥季",
                        "keyword": "萬華、生活、儀式活動"
                    }
                ]
            }
        ]
    },
    {
        "title": "建築",
        "link": "",
        "questions": [],
        "subClass": [
            {
                "title": "古老住宅",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/oldhouse.html",
                "questions": []
            },
            {
                "title": "西門紅樓",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/redbuilding.html",
                "questions": [
                    {
                        "ques_id": 28,
                        "question": "「這棟建築是台灣第一座官方興建的公營市場，建築以「八卦」造型為市場入口，代表八方雲集之意作；而「十字架」造型則是市場主體的特色。在政府及各個單位的努力經營下，現在又成為西區的指標性景點。」請問這裡最有可能是萬華的哪個地方？",
                        "answer": "西門紅樓",
                        "other_options": "第一蔬果批發市場##環南市場",
                        "keyword": "萬華、歷史、西門紅樓"
                    },
                    {
                        "ques_id": 41,
                        "question": "此建築位於西門町，興建完成迄今已逾百年，原是臺灣第一座官方興建的公營市場，現在為全台保存最完整的三級古蹟，是一座以紅磚所打造成的八角牆樓，請問此樓為?",
                        "answer": "西門紅樓",
                        "other_options": "萬華八角紅樓##艋舺紅磚樓",
                        "keyword": "萬華、建築、西門紅樓"
                    }
                ]
            },
            {
                "title": "宗教寺廟",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/temple.html",
                "questions": [
                    {
                        "ques_id": 36,
                        "question": "此廟為臺灣三級古蹟，與艋舺龍山寺、大龍峒保安宮合稱台北三大廟門，請問此廟為?",
                        "answer": "艋舺清水巖祖師廟",
                        "other_options": "青山宮##地藏王廟",
                        "keyword": "萬華、建築、宗教寺廟"
                    },
                    {
                        "ques_id": 40,
                        "question": "此廟為道光戊子年（1828年）所建立，為三級古蹟。雖然庵內光線幽暗，氣氛陰森，但迄今寺廟建築仍保持樸拙的風格。主祀神明為地藏王菩薩，請問此廟為？",
                        "answer": "地藏王廟",
                        "other_options": "慈雲寺##法華寺",
                        "keyword": "萬華、建築、宗教寺廟"
                    },
                    {
                        "ques_id": 42,
                        "question": "此曾經為臺灣最大的日式佛寺，創建於日治時期，但現今只剩下一些周邊的遺跡，在幾年前才被臺北市政府指定為歷史古蹟，請問此佛寺為？",
                        "answer": "西本願寺",
                        "other_options": "臨濟護國禪寺##東和禪寺",
                        "keyword": "萬華、建築、宗教寺廟"
                    }
                ]
            },
            {
                "title": "建築特色",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/characteristic.html",
                "questions": [
                    {
                        "ques_id": 39,
                        "question": "此建築特色又稱「店屋」，門口直接對外開店，並設置騎樓，方便路人逛街瀏覽貨品。為店舖與住宅混合的形式，為下列何種建築樣式？",
                        "answer": "街屋",
                        "other_options": "住屋##樓屋",
                        "keyword": "萬華、建築、建築特色"
                    }
                ]
            },
            {
                "title": "剝皮寮",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/bopiliao.html",
                "questions": []
            },
            {
                "title": "淡水育嬰堂",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/orphange.html",
                "questions": []
            },
            {
                "title": "學校",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/school.html",
                "questions": [
                    {
                        "ques_id": 34,
                        "question": "請問在艋舺第一所台灣人就讀的學校是?",
                        "answer": "老松國小",
                        "other_options": "龍山國小##西門國小",
                        "keyword": "萬華、建築、學校"
                    },
                    {
                        "ques_id": 37,
                        "question": "此書院為臺北市僅有的一座書院建築，為清朝時期臺北盆地五座書院之一，請問此書院名稱為?",
                        "answer": "學海書院",
                        "other_options": "明道書院##登瀛書院",
                        "keyword": "萬華、建築、學校"
                    }
                ]
            },
            {
                "title": "製糖文化園區",
                "link": "https:\/\/m4ru04j04cj86.000webhostapp.com\/dictionary\/architecture\/sugar.html",
                "questions": [
                    {
                        "ques_id": 38,
                        "question": "舊名為臺北製糖所，為早期製糖的重要工廠之一，經臺北市政府進行建築修補及改建為展示園區，後來由明華園進駐在此地方，但是在2011年爆發建築破壞事件，請問此展覽園區為何?",
                        "answer": "製糖文化園區",
                        "other_options": "臺北製糖園區##萬華糖廠園區",
                        "keyword": "萬華、建築、製糖文化園區"
                    }
                ]
            }
        ]
    }
];