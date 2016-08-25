/*
*                             /mMMMMNNM.
*                       `sssosdMMdyhyyhoos
*                     ..:NNNNNNNNhso++/dmN...
*                     MMNsyysyysymMMs+/+++NNm
*                  yddyhhsyysyysyyyhmmmmmmMMNyho
*                  dMMyyyyyyyyyyyyyymNMddmdddmmh:/-
*                  dNMyyyyyyyyyyyyyymNMo+++++yyhNMs
*               sdNo+osyysyysyysyysyyyhdmNNNNsyhMMs
*               hMMo//yyyyys/+/////////hdmddd//oNMs
*               hMMo+/yyysso.``  ``````osyyys  :NMs
*               hMMo++sys`.`     oNMMMM-`.MMm  :MMs
*               -//yhdsys```     sMMNNM-`.mNm  -mMs
*               .-:mMMyys.`` `   +hhhhh-.`hhy  :MMs
*               yNMMMMyys...`.`        `..   `./MMs
*         /mmdhmsosoooNNmoo+`./hmmmmhhmmmm``-mmmmMNmm/
*      .++sdmdhdo+++++hhhdds../yyysyyyysyyooohhhhdddms++.
*      :MMmyyo++++++++++oMMh.`..`..`..`..`MMN+//++oyymMM:
*      -mMdsyysy+++////++//sMMNmMMMMNNMMMM////+osyysydmM:
*   `osyhdhsyyyyo//hdh+++++oyyyyhyyhyyhyyyddh++osyysyhhdyss`
*   .MMNyyyyyyhhsooNMM++++++++++/+++++/++/MMNsoshhyyyyyyNMM.
*   .MMmsyysydNMMMMNNM++++//++++//++++/+++NNMMMMNMmsyyyyNMM.
*   .MMmsyysyyydNMMMMM////++/++/++///++/++MMMmNNyhysyysydNM.
*   .MMNyyyyyyyyNMMNNMooooooooooooooooooooNMMMMNyyyyyyyyNMM.
*   .MMmyyyyyyyyNMMNNMyyyyyyyyyyyyyyyyyyyyNMMMMmyyyyyyyyNMM.
*    ``/MMMMMMMM/``mMMsyysyysyysyysyssysyyMMm``/MMNmMMMM/``
*      .oooooooooooyyhoosyyyyyyyyyyysoooosyyyooooooooooo.
*            ```hMMo+/+++yyyyyyyyyyyo+/++++/+NMh```
*            sMMhyysyy////++/+yMMy///+++++/++syhMMs
*         :yydmMhsysyyoso//omds//yddo//oososssyhmMmyy:
*    --:::omNmmNhyyyyyyyysoshh+  +hhysoyyyyyyyyhmNNmNo:::::
*   .NMMMMmyyyyyyyyyyyyyhMMh        hMMyyyyyyyyyyyyyymMMMMM.
* hddyhhyhysyysyssysyysyymNh        yNMyyysyysyysyysyyyhyyhhdm
* MMMddddddhddddddddddhdmMMh        hMMmdddddhddddddddddhhdMMM
* MMMMMMMMMNMMMMMMMMMMNMMMMh        hMMMMMMMMNMMMMMMMMMMNNMMMM
*/
var Slides = require('./slide')
  , theme = require('./themes/Ptt');

const slides = [
  'slides/slide1.md',
  'slides/slide2.md',
  'slides/slide3.md',
  'slides/slide4.md'];

let noslide = new Slides(slides, theme);
noslide.render();
