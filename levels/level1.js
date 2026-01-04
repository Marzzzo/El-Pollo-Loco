const level1 = new Level(
  [], // enemies werden in der world.class.js hinzugefügt.
  [], // items werden in der world.class.js hinzugefügt.
  [
    new Cloud('img/5_background/layers/4_clouds/1.png', 0),
    new Cloud('img/5_background/layers/4_clouds/2.png', 750),
    new Cloud('img/5_background/layers/4_clouds/1.png', 750 * 2),
    new Cloud('img/5_background/layers/4_clouds/2.png', 750 * 3),
    new Cloud('img/5_background/layers/4_clouds/1.png', 750 * 4),
    new Cloud('img/5_background/layers/4_clouds/2.png', 750 * 5),
    new Cloud('img/5_background/layers/4_clouds/1.png', 750 * 6),
    new Cloud('img/5_background/layers/4_clouds/2.png', 750 * 7),
    new Cloud('img/5_background/layers/4_clouds/1.png', 750 * 8),
    new Cloud('img/5_background/layers/4_clouds/2.png', 750 * 9),
    new Cloud('img/5_background/layers/4_clouds/1.png', 750 * 10),
    new Cloud('img/5_background/layers/4_clouds/2.png', 750 * 11),
  ],
  [
    new BackgroundObject('img/5_background/layers/air.png', -960),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -960),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -960),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -960),

    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/air.png', 960),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 960),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 960),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 960),

    new BackgroundObject('img/5_background/layers/air.png', 960 * 2),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 960 * 2),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 960 * 2),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 960 * 2),
    new BackgroundObject('img/5_background/layers/air.png', 960 * 3),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 960 * 3),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 960 * 3),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 960 * 3),
  ]
);
