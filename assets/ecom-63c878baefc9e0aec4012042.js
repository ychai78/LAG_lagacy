
;
                (function(){
                    const Func = (function() {
                        if(!this.$el)return;const e=this.$el.querySelector(".ecom-product-single__description-view-more-btn"),t=this.settings.content_type,i=this.$el.querySelector(".ecom-product-single__description--full"),n=this.$el.querySelector(".ecom-product-single__description-view-less-btn"),a=this.$el.querySelector(".ecom-product-single__description--paragraph");e&&(e&&e.addEventListener("click",function(){t==="text"&&i?(i.style.display="block",a.style.display="none"):a.style.maxHeight=null,this.style.display="none",n&&(n.style.display="flex")}),n&&n.addEventListener("click",function(){e.style.display="flex",this.style.display="none",t==="text"&&i?(i&&(i.style.display="none"),a.style.display="block"):a.style.maxHeight="var(--ecom-description-height)"}))
                    
                    });
                    const settings = {"content_type":"html"};
                    const ID = 'ecom-95uvmn1g4qs';
                    document.querySelectorAll('.ecom-95uvmn1g4qs').forEach(function(el){
                        Func.call({$el: el, settings, id:ID,isLive: true});
                    });
                })();
            